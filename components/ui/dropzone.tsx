import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

type DropzoneProps = {
  onDrop: (files: File[]) => void;
  onDelete: () => void;
  url?: string;
  file?: File | null;
  className?: string;
  text?: string;
};

const Dropzone = ({
  onDrop,
  url,
  file,
  className,
  text,
  onDelete,
}: DropzoneProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    } else if (url) {
      setPreview(url);
    } else {
      setPreview(null);
    }

    return () => {
      if (file) URL.revokeObjectURL(preview || "");
    };
  }, [file, url]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const fileUrl = URL.createObjectURL(acceptedFiles[0]);
        setPreview(fileUrl);
        onDrop(acceptedFiles);
      }
    },
    [onDrop]
  );

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setPreview(null);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {preview ? (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md border border-dashed border-gray-400"
          />
          <button
            onClick={handleRemoveFile}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Eliminar archivo
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Arrastra para reemplazar el archivo
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          {text || "Arrastra o haz clic para seleccionar un archivo"}
        </p>
      )}
    </div>
  );
};

export default Dropzone;
