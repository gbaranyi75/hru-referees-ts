"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import Skeleton from "./common/Skeleton";
import { Modal } from "./common/Modal";
import { useModal } from "../hooks/useModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/common/DefaultTable";
import { formatSize, formatDate } from "@/lib/utils/formatUtils";
import OutlinedButton from "./common/OutlinedButton";
import PrimaryButton from "./common/PrimaryButton";
import DisabledButton from "./common/DisabledButton";

interface FileProps {
  Key: string;
  LastModified: string;
  Size: number;
  StorageClass: string;
  ETag: string;
}

const DocumentsList = ({
  fileList = [],
  loading,
  isAdmin,
  fetchFiles,
}: {
  fileList?: FileProps[];
  loading: boolean;
  isAdmin: boolean;
  fetchFiles: () => void;
}) => {
  const [files, setFiles] = useState<FileProps[]>([]);
  const [fileToDelete, setFileToDelete] = useState<FileProps>({} as FileProps);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { isOpen, openModal, closeModal } = useModal();

  const removeFile = async (file: FileProps) => {
    try {
      setIsDeleting(true);
      const endpoint = "/api/r2/files";
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: file.Key }),
      });

      if (!response.ok) {
        toast.error("A fájlt nem sikerült törölni");
        return;
      }
      fetchFiles();
      setIsDeleting(false);
      closeModal();
      toast.success("A fájl sikeresen törölve");
    } catch {
      toast.error("A fájlt nem sikerült törölni");
    }
  };

  const downloadFile = async (key: string) => {
    try {
      const endpoint = "/api/r2/files";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key }),
      });
      const { signedUrl } = await response.json();
      window.open(signedUrl, "_blank");
    } catch (error) {
      console.error("Hiba a fájl letöltésekor: ", error);
      alert("Hiba a fájl letöltésekor: " + error);
    }
  };

  const handleDelete = () => {
    removeFile(fileToDelete);
  };

  const handleDownload = (file: FileProps) => {
    downloadFile(file.Key);
  };

  const handleOpenModal = (file: FileProps) => {
    setFileToDelete(file);
    openModal();
  };

  useEffect(() => {
    if (!fileList.length) {
      setFiles([]);
      return;
    }
    const sortedList: FileProps[] = [...fileList].sort(
      (a: FileProps, b: FileProps) => {
        return (
          new Date(b.LastModified).getTime() -
          new Date(a.LastModified).getTime()
        );
      }
    );
    setFiles(sortedList);
  }, [fileList]);

  if (loading && fileList.length === 0)
    return (
      <>
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
      </>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          <TableHeader className="border-b border-gray-100 bg-gray-50">
            <TableRow className="text-sm text-center">
              <TableCell
                isHeader
                className="py-3 px-4 text-left font-medium text-gray-600 min-w-[320px]">
                Fájl neve
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-4 text-left font-medium text-gray-600 min-w-37.5">
                Módosítás dátuma
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-4 text-left font-medium text-gray-600 min-w-30">
                Méret
              </TableCell>
              <TableCell
                isHeader
                className="py-3 px-4 text-left font-medium text-gray-600">
                {""}
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100">
            {files.map((file: FileProps) => (
              <TableRow
                key={file.Key}
                className="text-sm text-center">
                <TableCell className="py-3 px-4 text-left font-normal text-gray-600">
                  {file.Key}
                </TableCell>
                <TableCell className="py-3 px-4 text-left font-normal text-gray-600">
                  {formatDate(file.LastModified)}
                </TableCell>
                <TableCell className="py-3 px-4 text-left font-normal text-gray-600">
                  {formatSize(file.Size)}
                </TableCell>
                <TableCell className="py-3 px-4 text-left font-normal text-gray-600">
                  <div className="flex flex-row gap-2 items-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleDownload(file)}>
                      <Icon
                        icon="lucide:download"
                        width="20"
                        height="20"
                        color="gray"
                      />
                    </button>
                    {isAdmin && (
                      <button
                        className="cursor-pointer"
                        onClick={() => handleOpenModal(file)}>
                        <Icon
                          icon="lucide:trash-2"
                          width="20"
                          height="20"
                          color="gray"
                        />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={true}
        className="max-w-125 p-5 lg:p-8">
        <div className="flex justify-center pt-4 px-2">
          <h6 className="mb-2 text-xl font-semibold text-gray-600 ">
            Biztosan törlöd ezt a fájlt?
          </h6>
        </div>
        <div className="flex items-center gap-3 px-2 pt-8 justify-around">
          <OutlinedButton
            onClick={closeModal}
            text="Mégsem"
          />
          {isDeleting ? (
            <DisabledButton text="Törlés..." />
          ) : (
            <PrimaryButton
              onClick={handleDelete}
              text="Törlés"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DocumentsList;
