import { Metadata } from "next";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "Good Brains Studio | Cinematic AI & Optical Engineering",
  description: "Broadcast-quality commercial video production, DaVinci Resolve Fusion color science, and programmatic motion design.",
  icons: {
    icon: "/goodbrains-logo.png",
    shortcut: "/goodbrains-logo.png",
    apple: "/goodbrains-logo.png",
  },
  openGraph: {
    title: "Good Brains Studio | Cinematic AI Commercials",
    description: "Transforming raw AI generations into broadcast-grade 4K cinema. Hollywood color science, anamorphic halation, and sub-pixel motion tracking.",
  }
};

export default function StudioPage() {
  return <StudioClient />;
}
