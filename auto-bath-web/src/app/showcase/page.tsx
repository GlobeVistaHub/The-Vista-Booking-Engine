import { Metadata } from "next";
import { ShowcaseClient } from "./ShowcaseClient";

export const metadata: Metadata = {
  title: "Engineering Showcase | Goodbrains Studio",
  description: "Advanced Full-Stack SaaS Engineering & Financial Automation.",
  openGraph: {
    title: "Engineering Showcase | Goodbrains Studio",
    description: "Deep dive into our scalable SaaS architecture, real-time timezone enforcement, and secure financial processing infrastructure.",
    images: ["/og-image.jpg"],
  }
};

export default function ShowcasePage() {
  return <ShowcaseClient />;
}
