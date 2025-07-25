import React, { useRef, type ReactNode } from "react";
import { Button } from "../atoms/Button";

interface FileUploadProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange"> {
  onChange?: (files: FileList | null) => void;
  files?: File[];
  children?: ReactNode;
}

function DefaultFileUploadButton() {
  return <Button>Select File</Button>;
}

export default function FileUpload({
  onChange,
  children = <DefaultFileUploadButton />,
  ...props
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        {...props}
        onChange={(e) => {
          onChange?.(e.target.files);
        }}
        type="file"
        className="hidden"
        ref={fileInputRef}
      />
      <div onClick={handleButtonClick}>{children}</div>
    </div>
  );
}
