import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene7 } from './Scene7';
import { BrandOutroHorizontal } from '../Episode3/BrandOutroHorizontal';
import { AnamorphicWhipPan } from '../Episode3/AnamorphicWhipPan';

export const Episode4OutroTail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", overflow: "hidden" }}>
      <AnamorphicWhipPan
        transitionStartFrame={30} // 1 second into this clip, we whip pan
        durationFrames={18}
        caColorA="rgba(255, 0, 85, 0.2)" // Mariya Magenta
        caColorB="rgba(0, 229, 204, 0.2)" // Cyan
        flareColor="rgba(255, 0, 85, 0.6)"
        childrenA={
          <Sequence from={0} durationInFrames={60}>
            {/* Shift Scene 7 forward so it renders the very end of her speech */}
            <Sequence from={-550}>
               <Scene7 />
            </Sequence>
          </Sequence>
        }
        childrenB={
          <Sequence from={30} durationInFrames={180}>
            <BrandOutroHorizontal />
          </Sequence>
        }
      />
    </AbsoluteFill>
  );
};
