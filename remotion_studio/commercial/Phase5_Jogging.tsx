import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const Phase5_Jogging: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("youtube-assets/ai-studio/jogging.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
