import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "英语随身听",
    short_name: "英语随身听",
    description: "零基础上班族英语学习网页 App",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/app-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
