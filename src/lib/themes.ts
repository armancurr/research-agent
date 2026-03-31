export const appThemes = [
  { value: "cursor-dark", label: "Cursor Dark" },
  { value: "noir-poimandres-darker", label: "Noir Poimandres Darker" },
] as const;

export type AppTheme = (typeof appThemes)[number]["value"];

export const DEFAULT_APP_THEME: AppTheme = "cursor-dark";
export const APP_THEME_STORAGE_KEY = "app-theme";

export function isAppTheme(value: string): value is AppTheme {
  return appThemes.some((theme) => theme.value === value);
}
