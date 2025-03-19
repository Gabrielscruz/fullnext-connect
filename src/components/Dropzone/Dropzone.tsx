'use client';
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function Dropzone() {
    const [file, setFile] = useState<File>()
  const onDrop = useCallback((acceptedFiles: any) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}

      className={`flex  flex-col items-center justify-center border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors px-4 pb-4 h-36 ${
        isDragActive ? "border-gray-400" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Solte o arquivo aqui...</p>
      ) : (
        <p>
          Arraste e solte um arquivo aqui, ou clique para selecionar o arquivo
        </p>
      )}
      {file && (
          <div className="mt-4 text-sm text-gray-700">
            <p>Arquivo: {file.name}</p>
            <p>Tamanho: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
      )}
    </div>
  );
}
