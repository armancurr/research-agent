export const appThemes = [
  {
    value: "celestial",
    label: "Celestial",
    transition: {
      background: "#0b0c0f",
      edge: "#e95378",
      glow: "rgba(233, 83, 120, 0.22)",
    },
  },
  {
    value: "cursor-dark",
    label: "Cursor Dark",
    transition: {
      background: "#141414",
      edge: "#4c9df3",
      glow: "rgba(76, 157, 243, 0.22)",
    },
  },
  {
    value: "noir-poimandres-darker",
    label: "Noir Poimandres Darker",
    transition: {
      background: "#0f1017",
      edge: "#add7ff",
      glow: "rgba(173, 215, 255, 0.22)",
    },
  },
  {
    value: "vesper-plus-plus",
    label: "Vesper ++",
    transition: {
      background: "#101010",
      edge: "#ffc799",
      glow: "rgba(255, 199, 153, 0.22)",
    },
  },
] as const;

export type AppTheme = (typeof appThemes)[number]["value"];

export const DEFAULT_APP_THEME: AppTheme = "cursor-dark";
export const APP_THEME_STORAGE_KEY = "app-theme";

export function isAppTheme(value: string): value is AppTheme {
  return appThemes.some((theme) => theme.value === value);
}

export function getAppTheme(theme: AppTheme) {
  return appThemes.find((option) => option.value === theme) ?? appThemes[0];
}
