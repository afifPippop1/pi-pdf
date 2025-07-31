import React from "react";

export function useFileUpload() {
  const ref = React.useRef<HTMLInputElement>(null);
  function onClick() {
    ref.current?.click();
  }
  function onChange(callback: (files: FileList | null) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      callback(e.target.files);
    };
  }

  return { ref, onClick, onChange };
}
