"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import PrimaryButton from "./PrimaryButton";
import DisabledButton from "./DisabledButton";

/**
 * A React component that allows users to drag and drop files or browse for files to upload.
 * It uses the react-dropzone library to handle file uploads.
 *
 * @return {React.FC} The DropZoneComponent.
 */
export interface FileWithMetadata {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  publicUrl?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
}

interface DropzoneProps {
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  onFilesChange?: (files: FileWithMetadata[]) => void;
  fetchFiles?: () => void;
  uploadSuccess?: () => void;
}

const DropZoneComponent = ({
  onFilesChange,
  accept = {
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.oasis.opendocument.text": [],
    "text/plain": [],
    "application/vnd.oasis.opendocument.presentation": [],
    "application/vnd.oasis.opendocument.spreadsheet": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [],
    "application/zip": [],
  },
  maxFiles = 1,
  maxSize = 1024 * 1024 * 50,
  fetchFiles,
  uploadSuccess,
}: DropzoneProps) => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  const uploadFile = async (file: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f))
    );

    setIsUploading(true);
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const endpoint = "/api/r2/upload";
      const presignedResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === file
              ? { ...f, uploading: false, progress: 0, error: true }
              : f
          )
        );
        return;
      }

      const { presignedUrl, key, publicUrl } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(percentComplete);
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? {
                      ...f,
                      progress: Math.round(percentComplete),
                      key: key,
                      publicUrl: publicUrl,
                    }
                  : f
              )
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? { ...f, progress: 100, uploading: false, error: false }
                  : f
              )
            );
            toast.success("Sikeres fájlfeltöltés");
            resolve();
            fetchFiles?.();
            setFiles([]);
            uploadSuccess?.();
          } else {
            reject(new Error(`Sikertelen feltöltés. Státusz: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Sikertelen feltöltés"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Sikertelen feltöltés");
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file
            ? { ...f, uploading: false, progress: 0, error: true }
            : f
        )
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: uuidv4(),
          file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        })),
      ]);
    }
  }, []);

  const handleUpload = useCallback(() => {
    files.forEach((file) => {
      if (!file.uploading) {
        uploadFile(file.file);
      }
    });
  }, [files]);

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length) {
        const fileTooLarge = fileRejections.find(
          (rejection) => rejection.errors[0].code === "file-too-large"
        );

        if (fileTooLarge) {
          toast.error(
            `A fájl túl nagy. Maximum ${maxSize / (1024 * 1024 * 50)}MB megengedett.`
          );
        }
      }
    },
    [maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles,
    maxSize,
    accept,
  });

  return (
    <div>
      {/* File Upload Card */}
      <div className="transition border border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-gray-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100"
            : "border-gray-300 bg-gray-50"
        }
      `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center !m-0">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-xl">
              {isDragActive ? "Húzd ide a fájlokat" : "Fájl böngeszése"}
            </h4>

            <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700">
              Húzd ide a feltöltendő fájlokat, vagy böngéssz
            </span>

            <span className="font-medium underline text-md text-brand-500 hover:text-blue-600">
              Fájl Böngészése
            </span>
          </div>
        </form>
      </div>

      {/* File Preview */}

      {files.length > 0 && (
        <div className="my-2 flex flex-col gap-3 max-w-[500px] mx-auto">
          <div className="flex flex-row gap-3 max-w-[500px] mx-auto justify-center items-center py-4">
            <p className="text-sm">{files[0]?.file?.name}</p>
            {isUploading ? (
              <DisabledButton text="Feltöltés..." />
            ) : (
              <PrimaryButton onClick={handleUpload} text="Feltöltés" />
            )}
          </div>
          {isUploading && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {uploadProgress.toFixed(2)}% feltöltve
                </p>
              </div>
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropZoneComponent;
