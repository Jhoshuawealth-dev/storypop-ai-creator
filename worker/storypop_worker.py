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


def upload(job_id: str, file_path: str) -> str:
    info = call("upload-url", jobId=job_id)
    with open(file_path, "rb") as f:
        r = requests.put(info["signedUrl"], data=f, headers={"Content-Type": "video/mp4"}, timeout=600)
    r.raise_for_status()
    return info["path"]


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
            path = render_video(job)
            report(job_id, 95, "Uploading video")
            remote = upload(job_id, path)
            call("complete", jobId=job_id, path=remote)
            print("Done", job_id)
        except Exception as e:
            traceback.print_exc()
            try:
                call("fail", jobId=job_id, error=str(e)[:900])
            except Exception:
                pass


if __name__ == "__main__":
    main()
