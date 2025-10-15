import React from "react";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function CardVideoFileSkleton() {
  return (
    <Card isBlurred className="card-videos-layout">
      <Skeleton className="rounded-lg">
        <div className="card-videos-img-miniature rounded-lg" />
      </Skeleton>
      <div className="w-full" style={{ height: 100, padding: 12 }}>
        <div className="flex gap-4 bg-default-300">
          <Skeleton
            className="bg-default-300 rounded-full"
            style={{ width: 30, height: 30, maxHeight: 50 }}
          />
          <div className="flex flex-col gap-4 w-full">
            <Skeleton
              className="rounded bg-default-200"
              style={{ width: "100%", height: 10 }}
            />
            <Skeleton
              className="rounded bg-default-200"
              style={{ width: "100%", height: 10 }}
            />
            <Skeleton
              className="rounded bg-default-200"
              style={{ width: 100, height: 5 }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function VideoPlayerSkleton() {
  return (
    <div className="col-span-8 video-player-layout">
      <Skeleton className="rounded-lg">
        <div className="video-player-viewe" />
      </Skeleton>
    </div>
  );
}

export function CommentItemSkeleton() {
  return (
    <div className="max-w-[300px] w-full flex items-center gap-3 mt-4 mt-2">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
