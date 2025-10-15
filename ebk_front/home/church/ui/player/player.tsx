import dynamic from "next/dynamic";
import React, { forwardRef } from "react";
import ReactPlayer from "react-player";

export default function WrappedPlayer({
  playerRef,
  ...props
}: {
  playerRef: any;
}) {
  return <ReactPlayer {...props} ref={playerRef} />;
}

const Player = dynamic(() => import("./player"), { ssr: false });

export const ForwardRefPlayer = forwardRef((props: any, ref) => (
  <Player {...props} playerRef={ref} />
));

ForwardRefPlayer.displayName = "ForwardRefPlayer";
