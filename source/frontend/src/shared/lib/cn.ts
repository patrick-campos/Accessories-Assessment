import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const FONT_FAMILIES = ["body", "display", "farfetch"];
const FONT_WEIGHTS = [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-family": [{ font: FONT_FAMILIES }],
      "font-weight": [{ "font-weight": FONT_WEIGHTS }],
    },
    conflictingClassGroups: {
      "font-family": [],
      "font-weight": [],
    },
  },
});

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs));
}
