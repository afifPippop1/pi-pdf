import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "~/store/hooks";
import type { Font } from "~/types";
import { PropertiesLabel } from "./PropertiesLabel";

interface FontPickerProps {
  font?: string;
  onFontChange?: (font: Font) => void;
}

function parseVariant(variant: string) {
  if (variant === "regular") return { weight: "400", style: "normal" };
  if (variant === "italic") return { weight: "400", style: "italic" };

  const match = variant.match(/^(\d+)(italic)?$/);
  if (match) {
    return {
      weight: match[1],
      style: match[2] ? "italic" : "normal",
    };
  }

  return { weight: "400", style: "normal" };
}

export function FontPicker({ font: selected, onFontChange }: FontPickerProps) {
  const fonts = useAppSelector((s) => s.editor.fonts);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (open && selected && listRef.current) {
      const el = listRef.current.querySelector<HTMLLIElement>(
        `li[data-value="${selected}"]`
      );
      el?.scrollIntoView({ block: "start" });
    }
  }, [open, selected]);

  const filtered = fonts.filter((font) =>
    font.family.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PropertiesLabel label="Font family">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white shadow-sm cursor-pointer"
        >
          {selected || "Select font..."}
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 outline-none"
            />

            <ul ref={listRef} className="max-h-40 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((font) => (
                  <li
                    key={font.family}
                    data-value={font.family}
                    onClick={async () => {
                      setOpen(false);
                      setQuery("");
                      if (font.family !== "Inter") {
                        for (const [variant, url] of Object.entries(
                          font.files
                        )) {
                          const { weight, style } = parseVariant(variant);
                          const fontFace = new FontFace(
                            font.family,
                            `url(${url})`,
                            {
                              weight: weight,
                              style: style,
                            }
                          );
                          await fontFace.load();
                          document.fonts.add(fontFace);
                        }
                      }
                      onFontChange?.(font);
                    }}
                    className={`px-3 py-2 cursor-pointer ${
                      selected === font.family
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {font.family}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500">No results</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </PropertiesLabel>
  );
}
