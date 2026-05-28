import { LessonVideoPlaceholder } from "@/features/classroom/components/LessonVideoPlaceholder";

type LessonVideoPanelProps = {
  title: string;
  videoUrl: string | null;
};

function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function LessonVideoPanel({ title, videoUrl }: LessonVideoPanelProps) {
  if (!videoUrl) {
    return <LessonVideoPlaceholder />;
  }

  if (isDirectVideoFile(videoUrl)) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface shadow-soft">
        <video
          controls
          preload="metadata"
          className="aspect-video h-auto w-full bg-[rgb(34,30,28)]"
        >
          <source src={videoUrl} />
          Tu navegador no soporta reproduccion de video embebido.
        </video>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface shadow-soft">
      <iframe
        src={videoUrl}
        title={`Video de la leccion ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video h-auto w-full"
      />
    </div>
  );
}
