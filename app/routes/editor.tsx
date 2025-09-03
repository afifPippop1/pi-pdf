import { Suspense, useEffect } from "react";
import { useLoaderData } from "react-router";
import { EditorPage } from "~/components/pages/EditorPage.client";
import { useAppDispatch } from "~/store/hooks";
import { setFonts } from "~/store/slices/editorSlice";

export async function loader() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const apiUrl = process.env.GOOGLE_FONT_API;
  const response = await fetch(`${apiUrl}${apiKey}`);
  const result = await response.json();
  return { result };
}

export default function Editor() {
  const { result } = useLoaderData<typeof loader>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (result?.items) dispatch(setFonts(result.items));
  }, []);

  return (
    <Suspense fallback={<></>}>
      <EditorPage />
    </Suspense>
  );
}
