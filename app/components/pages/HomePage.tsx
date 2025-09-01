import Dropzone from "react-dropzone";
import { useNavigate } from "react-router";
import { setPDFDoc } from "~/utils";
import { UploadBoxIcon } from "../atoms/UploadBoxIcon";
import { Button } from "../atoms/Button";

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="lg:max-w-4xl w-full flex flex-col items-center">
      <h1 className="lg:text-3xl text-2xl font-bold text-gray-800 mb-2">
        Welcome to Pi-DF
      </h1>
      <p className="text-gray-500 text-xs lg:text-base mb-8">
        Upload and annotate your pdf easily
      </p>
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
            className="h-80 w-full shadow-md flex flex-col gap-4 items-center justify-center outline-1 outline-dashed rounded"
          >
            <input {...getInputProps()} />
            <UploadBoxIcon color="transparent" />
            <p className="text-xs md:text-base text-gray-500">
              Start by dropping your file's here
            </p>
            <p className="text-xs md:text-sm text-gray-500">or</p>
            <Button>Select from device</Button>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
