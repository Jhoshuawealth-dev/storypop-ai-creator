"""
Storypop local GPU worker.

Runs on the laptop that has your AI video models installed. It asks Storypop
for the next queued video, renders it locally, uploads the MP4 and reports back.
Only outbound HTTPS is used: no port forwarding or tunnels needed.

Setup:
  pip install requests python-dotenv
  create a .env file next to this script:
      STORYPOP_URL=https://storypop-ai-forge.lovable.app
      STORYPOP_WORKER_TOKEN=<the same token saved in Storypop's backend secrets>
      WORKER_ID=my-laptop
  python storypop_worker.py

Plug your model into `render_video()` below.
"""
import os
import subprocess
import time
import traceback

import requests
from dotenv import load_dotenv

load_dotenv()
BASE = os.environ["STORYPOP_URL"].rstrip("/")
TOKEN = os.environ["STORYPOP_WORKER_TOKEN"]
WORKER_ID = os.environ.get("WORKER_ID", "laptop")
POLL_SECONDS = int(os.environ.get("POLL_SECONDS", "5"))
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "./renders")


def call(action: str, **payload):
    r = requests.post(
        f"{BASE}/api/public/worker",
        json={"action": action, **payload},
        headers={"Authorization": f"Bearer {TOKEN}"},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()


def report(job_id: str, progress: int, stage: str):
    try:
        call("progress", jobId=job_id, progress=progress, stage=stage)
    except Exception as e:  # progress updates are best-effort
        print("progress update failed:", e)


def render_video(job: dict) -> str:
    """
    Replace this with a call to YOUR local model and return the path of the MP4.

    job["input"] contains:
      idea, title, script {hook, body, cta}, scenes [...], voiceId, styleId,
      ratio ("9:16" | "16:9" | "1:1"), duration (seconds)

    Examples:
      - ComfyUI: POST the workflow JSON to http://127.0.0.1:8188/prompt,
        poll /history/<prompt_id>, then read the output file.
      - Your own FastAPI: requests.post("http://127.0.0.1:8000/generate", json=job["input"])
      - A Python function: from my_model import generate; return generate(**job["input"])
    """
    job_id = job["id"]
    report(job_id, 10, "Writing script")
    report(job_id, 30, "Generating scenes")
    raise NotImplementedError("Connect your local model inside render_video()")


def upload(job_id: str, file_path: str, kind: str = "video", index: int = 0) -> str:
    info = call("upload-url", jobId=job_id, kind=kind, index=index)
    content_type = "image/jpeg" if kind in ("thumbnail", "clip-thumb") else "video/mp4"
    with open(file_path, "rb") as f:
        r = requests.put(info["signedUrl"], data=f, headers={"Content-Type": content_type}, timeout=600)
    r.raise_for_status()
    return info["path"]


def make_thumbnail(video_path: str):
    """Grab a crisp JPEG frame at 1s with FFmpeg (falls back to the first frame)."""
    out = os.path.splitext(video_path)[0] + "_thumb.jpg"
    for seek in ("00:00:01", "00:00:00"):
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-ss", seek, "-i", video_path, "-vframes", "1", "-q:v", "2", out],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60,
            )
            if os.path.exists(out) and os.path.getsize(out) > 0:
                return out
        except Exception as e:
            print("thumbnail attempt failed:", e)
    return None


def clip_video(job: dict) -> list:
    """
    Long video -> short clips. Uses PySceneDetect (cut points), Whisper (transcript),
    Qwen via Ollama (pick the best hooks), FFmpeg (cut, reframe, captions).
    Returns a list of clip dicts for the "complete" call.
    """
    import json as _json
    job_id = job["id"]
    opts = job.get("input") or {}
    length = int(opts.get("clipLength", 30))
    count = int(opts.get("count", 5))
    ratio = opts.get("ratio", "9:16")

    report(job_id, 5, "Downloading video")
    src_url = call("source-url", jobId=job_id)["signedUrl"]
    src = os.path.join(OUTPUT_DIR, f"{job_id}_source.mp4")
    with requests.get(src_url, stream=True, timeout=600) as r:
        r.raise_for_status()
        with open(src, "wb") as f:
            for chunk in r.iter_content(1 << 20):
                f.write(chunk)

    report(job_id, 20, "Detecting scenes")
    from scenedetect import detect, ContentDetector
    cuts = [s[0].get_seconds() for s in detect(src, ContentDetector())] or [0.0]

    report(job_id, 35, "Transcribing audio")
    import whisper
    segments = whisper.load_model("tiny").transcribe(src)["segments"]
    transcript = "\n".join(f"[{s['start']:.1f}-{s['end']:.1f}] {s['text'].strip()}" for s in segments)

    report(job_id, 55, "Finding the best moments")
    prompt = (
        f"From this timestamped transcript pick the {count} most engaging, self-contained moments of about {length} seconds "
        "for TikTok/Reels/Shorts. Reply ONLY with a JSON array of objects: "
        '{"start": seconds, "end": seconds, "title": short catchy title, "score": 0-100 viral potential, "quote": strongest line}.\n\n'
        + transcript[:12000]
    )
    resp = requests.post("http://127.0.0.1:11434/api/generate",
                         json={"model": "qwen3:4b", "prompt": prompt, "stream": False, "format": "json"}, timeout=600).json()
    picks = _json.loads(resp.get("response", "[]"))
    if isinstance(picks, dict):
        picks = next((v for v in picks.values() if isinstance(v, list)), [])
    picks = picks[:count]

    vf = {"9:16": "crop=ih*9/16:ih,scale=720:1280", "1:1": "crop=ih:ih,scale=1080:1080", "16:9": "scale=1280:-2"}[ratio]
    clips = []
    for i, p in enumerate(picks):
        start = float(p.get("start", 0))
        # snap to nearest scene cut so clips don't start mid-shot
        start = min(cuts, key=lambda c: abs(c - start)) if abs(min(cuts, key=lambda c: abs(c - start)) - start) < 3 else start
        end = max(start + 5, min(float(p.get("end", start + length)), start + length + 5))
        report(job_id, 60 + int(35 * i / max(1, len(picks))), f"Cutting clip {i + 1} of {len(picks)}")
        out = os.path.join(OUTPUT_DIR, f"{job_id}_clip{i}.mp4")
        subprocess.run(["ffmpeg", "-y", "-ss", str(start), "-to", str(end), "-i", src, "-vf", vf,
                        "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", out],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=900)
        remote = upload(job_id, out, kind="clip", index=i)
        thumb_remote = None
        thumb = make_thumbnail(out)
        if thumb:
            try:
                thumb_remote = upload(job_id, thumb, kind="clip-thumb", index=i)
            except Exception as e:
                print("clip thumbnail upload failed:", e)
        clips.append({"path": remote, "thumbnailPath": thumb_remote, "start": start, "end": end,
                      "title": p.get("title", f"Clip {i + 1}"), "score": p.get("score", 0), "quote": p.get("quote", "")})
    if not clips:
        raise RuntimeError("No good moments found in this video")
    return clips


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Storypop worker '{WORKER_ID}' polling {BASE} ...")
    while True:
        try:
            job = call("claim", workerId=WORKER_ID).get("job")
        except Exception as e:
            print("Could not reach Storypop:", e)
            time.sleep(POLL_SECONDS * 2)
            continue
        if not job:
            time.sleep(POLL_SECONDS)
            continue

        job_id = job["id"]
        print("Rendering job", job_id)
        try:
            if job.get("kind") == "clip":
                clips = clip_video(job)
                call("complete", jobId=job_id, clips=clips)
                print("Clips done", job_id)
                continue
            path = render_video(job)
            report(job_id, 95, "Uploading video")
            remote = upload(job_id, path)
            thumb_remote = None
            thumb = make_thumbnail(path)
            if thumb:
                try:
                    thumb_remote = upload(job_id, thumb, kind="thumbnail")
                except Exception as e:  # a missing thumbnail never fails the video
                    print("thumbnail upload failed:", e)
            call("complete", jobId=job_id, path=remote, thumbnailPath=thumb_remote)
            print("Done", job_id)
        except Exception as e:
            traceback.print_exc()
            try:
                call("fail", jobId=job_id, error=str(e)[:900])
            except Exception:
                pass


if __name__ == "__main__":
    main()
