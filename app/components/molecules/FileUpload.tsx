import React, { type ReactNode } from "react";
import { useFileUpload } from "~/hooks/useFileUpload";
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
  const { onChange: handleChange, onClick, ref } = useFileUpload();

  return (
    <div>
      <input
        {...props}
        onChange={onChange && handleChange(onChange)}
        type="file"
        className="hidden"
        accept="application/pdf"
        ref={ref}
      />
      <div onClick={onClick}>{children}</div>
    </div>
  );
}
