import { store } from "~/store/store";

export function getFontFile(fontFamily: string, weight: string) {
  const fonts = store.getState().editor.fonts;
  const font = fonts.find((f) => f.family === fontFamily);
  if (font?.files && weight in font.files) {
    return font.files[weight];
  } else if (font?.files && "regular" in font.files) {
    return font.files["regular"];
  }
  return;
}
