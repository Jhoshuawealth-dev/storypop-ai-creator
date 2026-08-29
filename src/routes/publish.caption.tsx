import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { CaptionHashtagEditor } from "./editor.captions";

export const Route = createFileRoute("/publish/caption")({
  head: pageHead("Caption & Hashtags", "AI-generated caption and hashtags for your post."),
  component: PublishCaption,
});

function PublishCaption() {
  return (
    <div className="relative">
      <CaptionHashtagEditor backTo="/publish" />
      <div className="mx-auto -mt-6 w-full max-w-md px-5 pb-10">
        <Link to="/publish/schedule" className="block">
          <Button size="lg" fullWidth>
            Next
          </Button>
        </Link>
      </div>
    </div>
  );
}
