import React from "react";
import { Composition, registerRoot } from "remotion";
import { VistaPromo } from "./Composition";
import { YoutubeIntro } from "./youtube/IntroComposition";
import { YoutubeOutro } from "./youtube/OutroComposition";

import { IntroVariantA } from "./youtube/IntroVariantA";
import { IntroVariantB } from "./youtube/IntroVariantB";
import { OutroDollyWink } from "./youtube/OutroDollyWink";
import { ShortConcept3, BROLL_DURATION } from "./youtube/ShortConcept3";
import { ShortConcept4, TOTAL_DURATION as SHORT4_DURATION } from "./youtube/ShortConcept4";
import { ShortConcept5, TOTAL_DURATION as SHORT5_DURATION } from "./youtube/ShortConcept5";
import { ShortWorldCup } from "./youtube/ShortWorldCup";
import { ShortWorldCupV2 } from "./youtube/ShortWorldCupV2";
import { ComicMazen } from "./youtube/ComicMazen";
import { MazenAndMariyaOrbit } from "./youtube/MazenAndMariyaOrbit";
import { GlobeVistaWorldCup } from "./youtube/GlobeVistaWorldCup";
import { HarfenEpisode1, EPISODE_1_DURATION } from "./youtube/HarfenEpisode1";
import { HarfenEpisode1Part2, EPISODE_1_PART_2_DURATION } from "./youtube/HarfenEpisode1Part2";
import { AltayebatCommercial } from "./commercial/AltayebatCommercial";
import { AiNewsEpisode2, TOTAL_FRAMES as EP2_FRAMES } from "./youtube/AiNewsEpisode2";
import { Episode3, TOTAL_DURATION as EP3_DURATION } from "./youtube/Episode3";
import { ShortScene5Vertical } from "./youtube/Episode3/ShortScene5Vertical";
import { ShortFinaleVertical } from "./youtube/Episode3/ShortFinaleVertical";
import { Episode4Scene1 } from "./youtube/Episode4/Scene1";
import { Episode4 as Episode4Master, EPISODE4_DURATION } from "./youtube/Episode4/Episode4";
import { Episode4OutroTail } from "./youtube/Episode4/Episode4OutroTail";
import { Episode5Scene1 } from "./youtube/Episode5/Scene1";
import { Episode5Scene1Vertical } from "./youtube/Episode5/Scene1Vertical";
import { Teaser2Horizontal } from "./youtube/Episode5/Teaser2Horizontal";
import { GoodBrainsCommercial, GB_COMMERCIAL_DURATION } from "./commercial/GoodBrainsCommercial";
import { GoodBrainsCommercialVertical, GB_VERTICAL_DURATION } from "./commercial/GoodBrainsCommercial_Vertical";
import { GoodBrainsHook } from "./commercial/GoodBrainsHook";
import { GoodBrainsCommercialEN, GB_COMMERCIAL_EN_DURATION } from "./commercial/GoodBrainsCommercial_EN";
import { GoodBrainsHookEN } from "./commercial/GoodBrainsHook_EN";
import { GoodBrainsCommercialVerticalEN, GB_VERTICAL_EN_DURATION } from "./commercial/GoodBrainsCommercial_Vertical_EN";
import { CharacterConsistencyReel, CHARACTER_CONSISTENCY_REEL_DURATION } from "./youtube/CharacterConsistencyReel";
import { CharacterConsistencyReelEn, CHARACTER_CONSISTENCY_REEL_EN_DURATION } from "./youtube/CharacterConsistencyReelEn";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VistaPromo"
        component={VistaPromo}
        durationInFrames={1200}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="YoutubeIntro"
        component={YoutubeIntro}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="IntroVariantA"
        component={IntroVariantA}
        durationInFrames={360}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="IntroVariantB"
        component={IntroVariantB}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="YoutubeOutro"
        component={YoutubeOutro}
        durationInFrames={600} // 10 seconds
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="OutroDollyWink"
        component={OutroDollyWink}
        durationInFrames={600} // 10 seconds
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ShortConcept3"
        component={ShortConcept3}
        durationInFrames={BROLL_DURATION} // 24 seconds
        fps={24}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="ShortConcept4"
        component={ShortConcept4}
        durationInFrames={SHORT4_DURATION} // 30 seconds
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="ShortConcept5"
        component={ShortConcept5}
        durationInFrames={SHORT5_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="ShortWorldCup"
        component={ShortWorldCup}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="ComicMazen"
        component={ComicMazen}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="ShortWorldCupV2"
        component={ShortWorldCupV2}
        durationInFrames={910}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="MazenAndMariyaOrbit"
        component={MazenAndMariyaOrbit}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="GlobeVistaWorldCup"
        component={GlobeVistaWorldCup}
        durationInFrames={360}
        fps={24}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="HarfenEpisode1"
        component={HarfenEpisode1}
        durationInFrames={EPISODE_1_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="HarfenEpisode1Part2"
        component={HarfenEpisode1Part2}
        durationInFrames={EPISODE_1_PART_2_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="AltayebatCommercial"
        component={AltayebatCommercial}
        durationInFrames={1096}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AiNewsEpisode2"
        component={AiNewsEpisode2}
        durationInFrames={EP2_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="Episode3"
        component={Episode3}
        durationInFrames={EP3_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ShortScene5Vertical"
        component={ShortScene5Vertical}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="ShortFinaleVertical"
        component={ShortFinaleVertical}
        durationInFrames={1422}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="Episode4Scene1"
        component={Episode4Scene1}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="Episode4"
        component={Episode4Master}
        durationInFrames={EPISODE4_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="Episode4OutroTail"
        component={Episode4OutroTail}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="GoodBrainsCommercial"
        component={GoodBrainsCommercial}
        durationInFrames={GB_COMMERCIAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="GoodBrainsCommercialVertical"
        component={GoodBrainsCommercialVertical}
        durationInFrames={GB_VERTICAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* 
        Standalone Hook: 2.5 seconds @ 30fps.
      */}
      <Composition
        id="GoodBrainsHook"
        component={GoodBrainsHook}
        durationInFrames={75}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* --- ENGLISH VERSIONS --- */}
      <Composition
        id="GoodBrainsCommercialEN"
        component={GoodBrainsCommercialEN}
        durationInFrames={GB_COMMERCIAL_EN_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="GoodBrainsHookEN"
        component={GoodBrainsHookEN}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GoodBrainsCommercialVerticalEN"
        component={GoodBrainsCommercialVerticalEN}
        durationInFrames={GB_VERTICAL_EN_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* --- EPISODE 5 --- */}
      <Composition
        id="Episode5Teaser2Horizontal"
        component={Teaser2Horizontal}
        durationInFrames={1511} // 50.37s: 44.37s story (1331 frames @ 00:44.11) + 6.00s full outro
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="Episode5Scene1"
        component={Episode5Scene1}
        durationInFrames={1290} // 43.0s total: Scene 1 runs to 00:37.00 (frame 1110) + full 6.0s (180 frames) Outro
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="Episode5Scene1Vertical"
        component={Episode5Scene1Vertical}
        durationInFrames={1290} // 43.0s total: 9:16 vertical reframing for YouTube Shorts & TikTok
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* --- CHARACTER CONSISTENCY KINETIC REEL (VERTICAL 9:16) - ARABIC REFERENCE --- */}
      <Composition
        id="CharacterConsistencyReel"
        component={CharacterConsistencyReel}
        durationInFrames={CHARACTER_CONSISTENCY_REEL_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* --- CHARACTER CONSISTENCY KINETIC REEL (VERTICAL 9:16) - ENGLISH MIRRORED --- */}
      <Composition
        id="CharacterConsistencyReelEn"
        component={CharacterConsistencyReelEn}
        durationInFrames={CHARACTER_CONSISTENCY_REEL_EN_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

registerRoot(RemotionRoot);
