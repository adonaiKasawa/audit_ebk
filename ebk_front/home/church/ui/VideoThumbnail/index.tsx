import { Image } from "@heroui/image";
import React, { useState, useEffect, useRef } from "react";

interface ThumbnailImageProps {
  snapshot: string;
}

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({ snapshot }) => (
  <div>
    <Image alt="my video thumbnail" className="object-cover" src={snapshot} />
  </div>
);

interface VideoThumbnailProps {
  cors?: boolean;
  width?: number;
  height?: number;
  renderThumbnail?: boolean;
  snapshotAtTime?: number;
  thumbnailHandler?: (thumbnail: string) => void;
  videoUrl: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  cors = false,
  width,
  height,
  renderThumbnail = true,
  snapshotAtTime = 2,
  thumbnailHandler,
  videoUrl,
}) => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [metadataLoaded, setMetadataLoaded] = useState<boolean>(false);
  const [seeked, setSeeked] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [suspended, setSuspended] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!cors && videoRef.current) {
      videoRef.current.setAttribute("crossOrigin", "Anonymous");
    }
  }, [cors]);

  useEffect(() => {
    if (!snapshot && metadataLoaded && dataLoaded && suspended) {
      generateSnapshot();
    }
  }, [
    cors,
    dataLoaded,
    height,
    metadataLoaded,
    seeked,
    snapshot,
    snapshotAtTime,
    suspended,
    thumbnailHandler,
    width,
  ]);

  const generateSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (!video.currentTime || video.currentTime < snapshotAtTime) {
      video.currentTime = snapshotAtTime;
    }
    if (seeked && !snapshot) {
      try {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        const context = canvas.getContext("2d");

        if (!context) return;

        if (!width || !height) {
          context.drawImage(video, 0, 0, 100, 100);
        } else {
          context.drawImage(video, 0, 0, 100, 100);
        }

        const thumbnail = canvas.toDataURL("image/png");

        video.src = "";
        video.remove();
        canvas.remove();

        setSnapshot(thumbnail);

        if (thumbnailHandler) {
          thumbnailHandler(thumbnail);
        }
      } finally {
      }
    }
  };

  return (
    <div className=" bg-blue-500">
      {!snapshot && (
        <div>
          <canvas ref={canvasRef} className="snapshot-generator" />
          <video
            ref={videoRef}
            muted
            className="snapshot-generator"
            height={100}
            src={videoUrl}
            width={100}
            onLoadedData={() => setDataLoaded(true)}
            onLoadedMetadata={() => setMetadataLoaded(true)}
            onSeeked={() => setSeeked(true)}
            onSuspend={() => setSuspended(true)}
          />
        </div>
      )}
      {snapshot && renderThumbnail && <ThumbnailImage snapshot={snapshot} />}
    </div>
  );
};

export default VideoThumbnail;
