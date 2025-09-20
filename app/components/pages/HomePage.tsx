import type { ReactNode } from "react";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router";
import VectorUploadPDF from "~/resources/icons/Vector - Upload PDF.svg?react";
import IconChecked from "~/resources/icons/basil_checked-box-solid.svg?react";
import { setPDFDoc } from "~/utils";
import { Button } from "../atoms/Button";

function FeatureItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 items-center">
      <IconChecked className="w-8 h-8 w-min-8 h-min-8" />
      <p>{children}</p>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-200 h-fit p-4 flex gap-9 flex-row items-center w-full shadow-lg">
      <div className="flex flex-col flex-1 gap-6">
        <h1 className="font-bold text-4xl">PDF Annotator</h1>
        <h3 className="font-bold text-2xl">
          Upload and annotate your PDF easily!
        </h3>
        <div className="flex flex-col">
          <FeatureItem>Upload your PDF</FeatureItem>
          <FeatureItem>Annotate text, highlight, or draw</FeatureItem>
          <FeatureItem>Save & Download</FeatureItem>
        </div>
      </div>
      <Dropzone
        onDrop={async (files) => {
          await setPDFDoc(files);
          navigate("/editor");
        }}
        accept={{
          "application/pdf": [],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="w-full flex flex-col gap-4 items-center justify-center outline-1 outline-dashed outline-gray-400 rounded flex-1 p-4"
          >
            <input {...getInputProps()} />
            <h3 className="font-bold text-2xl">Upload your files</h3>
            <VectorUploadPDF className="h-40" />
            <p className="text-xs md:text-base text-gray-500">
              Drop PDF files here
            </p>
            <div className="flex gap-4 w-full items-center text-gray-400">
              <hr className="flex-1" />
              <p className="text-xs md:text-sm">OR</p>
              <hr className="flex-1" />
            </div>
            <Button>Upload to edit</Button>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
