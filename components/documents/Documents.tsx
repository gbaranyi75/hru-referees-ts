"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import DocumentsList from "./DocumentsList";
import DropZoneComponent from "../common/DropZone";

interface FileProps {
  Key: string;
  LastModified: string;
  Size: number;
  StorageClass: string;
  ETag: string;
}

const Documents = ({ isAdmin }: { isAdmin: boolean }) => {
  const [fileList, setFileList] = useState<FileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editModeOpen, setEditModeOpen] = useState<boolean>(false);

  const toggleEditMode = () => {
    setEditModeOpen(!editModeOpen);
  };

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const filesData = await fetch("/api/r2/files").then((res) => res.json());
      const contents = Array.isArray(filesData?.Contents)
        ? filesData.Contents
        : [];
      setFileList(contents);
    } catch (err) {
      console.error("error", err);
      setFileList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
      {isAdmin && (
        <div className="flex flex-col mb-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
            <button
              onClick={toggleEditMode}
              className="flex w-full items-center justify-center gap-2 rounded-full border mb-4 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto">
              <Icon
                icon="lucide:plus"
                width="20"
                height="20"
              />
              {editModeOpen ? "Mégsem" : "Új fájl feltöltése"}
            </button>
          </div>
          {editModeOpen && (
            <DropZoneComponent
              fetchFiles={fetchFiles}
              uploadSuccess={toggleEditMode}
            />
          )}
        </div>
      )}
      <DocumentsList
        fileList={fileList}
        loading={loading}
        isAdmin={isAdmin}
        fetchFiles={fetchFiles}
      />
    </div>
  );
};

export default Documents;
