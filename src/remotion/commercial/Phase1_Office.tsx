import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const Phase1_Office: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("youtube-assets/ai-studio/office.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
