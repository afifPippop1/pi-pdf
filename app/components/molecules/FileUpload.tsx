import React, { type ChangeEvent, type ReactNode } from "react";
import { useFileUpload } from "~/hooks/useFileUpload";
import { Button } from "../atoms/Button";

interface FileUploadProps extends Omit<
  React.HTMLProps<HTMLInputElement>,
  "onChange"
> {
  onChange?: (files: FileList | null) => void;
  files?: File[];
  children?: ReactNode;
  resetOnChange?: boolean;
}

function DefaultFileUploadButton() {
  return <Button>Select File</Button>;
}

export default function FileUpload({
  onChange,
  children = <DefaultFileUploadButton />,
  resetOnChange,
  ...props
}: FileUploadProps) {
  const { onChange: handleChange, onClick, ref } = useFileUpload();
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      handleChange(onChange)(e);
      if (resetOnChange) {
        e.target.value = "";
      }
    }
  }

  return (
    <div>
      <input
        {...props}
        onChange={handleInputChange}
        type="file"
        className="hidden"
        accept="application/pdf"
        ref={ref}
      />
      <div onClick={onClick}>{children}</div>
    </div>
  );
}
