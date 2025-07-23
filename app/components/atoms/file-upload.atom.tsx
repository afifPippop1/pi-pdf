import React from "react";

interface FileUploadProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange"> {
  onChange?: (files: FileList | null) => void;
  files?: File[];
}

export default function FileUpload({ onChange, ...props }: FileUploadProps) {
  return (
    <input
      {...props}
      onChange={(e) => {
        onChange?.(e.target.files);
      }}
      type="file"
    />
  );
}
