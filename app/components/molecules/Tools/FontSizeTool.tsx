import { ToolTitle } from "~/components/atoms/ToolTitle";
import React, { useState, useRef, useEffect } from "react";

const COMMON_FONT_SIZES = [8, 10, 12, 14, 16, 18, 24, 32, 48, 72];

interface FontSizeToolProps {
  fontSize: number;
  onChange: (fontSize: number | string) => void;
}

export function FontSizeTool({fontSize, onChange}: FontSizeToolProps) {
  // const [fontSize, setFontSize] = useState<number | string>(12);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle input change (typed value)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty value so user can clear and type
    if (value === "") {
      onChange("");
    } else {
      // Only allow numbers
      const num = Number(value);
      if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((open) => !open);
  };

  const selectSize = (size: number) => {
    onChange(size);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <ToolTitle>FontSize</ToolTitle>
      <div
        ref={containerRef}
        className="relative inline-flex items-center w-20 text-sm bg-white border border-gray-300 rounded"
      >
        <input
          type="text"
          min={1}
          value={fontSize}
          onChange={handleInputChange}
          className="w-full px-2 py-1 pr-7 text-sm font-sans outline-none border-none"
          onFocus={() => setDropdownOpen(false)}
        />
        <button
          type="button"
          onClick={toggleDropdown}
          aria-label="Toggle font size dropdown"
          className="absolute right-0 top-0 h-full w-6 flex items-center justify-center text-xs cursor-pointer bg-transparent border-none"
          tabIndex={-1}
        >
          ▼
        </button>
        {dropdownOpen && (
          <ul className="absolute right-0 mt-1 w-20 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50">
            {COMMON_FONT_SIZES.map((size) => (
              <li
                key={size}
                onClick={() => selectSize(size)}
                className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                  size === fontSize ? "bg-blue-100" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
              >
                {size}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
