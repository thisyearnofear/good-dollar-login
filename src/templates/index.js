import ModernLogin from "../components/ModernLogin/ModernLogin";
import SlideLogin from "../components/SlideLogin/SlideLogin";

export const templates = {
  slide: {
    name: "Angel",
    component: SlideLogin,
    description: "An innovative sliding panel design with gesture support",
    preview: "/previews/slide.png",
    features: [
      "Sliding animations",
      "Gesture controls",
      "Full-screen experience",
      "Interactive transitions",
    ],
  },
  modern: {
    name: "Dollar",
    component: ModernLogin,
    description: "A clean, modern card-based interface with smooth transitions",
    preview: "/previews/modern.png",
    features: [
      "Elegant card layout",
      "Smooth transitions",
      "Environment tabs",
      "Professional styling",
    ],
  },
};

export const defaultTemplate = "modern";
