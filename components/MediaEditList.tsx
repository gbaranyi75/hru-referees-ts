"use client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Media } from "@/types/types";
import Skeleton from "@/components/common/Skeleton";
import Input from "@/components/common/InputField";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "./common/Table";
import { updateMedia } from "@/lib/actions/updateMedia";
import { formatDate } from "@/lib/utils/formatUtils";

export default function MediaEditList({
  mediaList,
  loadMediaAction,
}: {
  mediaList: Media[];
  loadMediaAction: () => void;
}) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [name, setName] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetToEdit = (media: Media) => {
    setSelectedMedia(media);
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setSelectedMedia(null);
    setIsEditMode(!isEditMode);
  };

  const handleSave = useCallback(async () => {
    try {
      if (!name && !mediaUrl) return;
      setLoading(true);
      let mediaName = name ? name : (selectedMedia?.name as string);
      let url = mediaUrl ? mediaUrl : (selectedMedia?.mediaUrl as string);
      const id = selectedMedia?._id;
      const response = await updateMedia(id, mediaName, url);

      const success = response instanceof Error ? false : response.success;
      if (success) {
        toast.success("Sikeres mentés");
        loadMediaAction();
        setIsEditMode(false);
        setSelectedMedia(null);
        setName("");
        setMediaUrl("");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [name, mediaUrl]);

  if (loading || !mediaList)
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-18 mb-2" />
        ))}
      </>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 bg-gray-50">
            <TableRow className="text-sm text-center">
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-[166px]"
              >
                Név
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-[166px]"
              >
                URL
              </TableCell>
              <TableCell
                isHeader
                className="px-2 py-4 font-bold text-gray-600 w-[166px]"
              >
                Létrehozva
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-4 font-bold text-gray-600 w-[166px]"
              >
                Szerkesztés
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100">
            {mediaList.map((media) => (
              <TableRow key={media._id} className="text-xs text-center h-16">
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedMedia?._id === media._id ? (
                    <Input
                      type="text"
                      name="name"
                      defaultValue={media.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <span>{media.name}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  {isEditMode && selectedMedia?._id === media._id ? (
                    <Input
                      type="text"
                      name="mediaUrl"
                      defaultValue={media.mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                  ) : (
                    <span>{media.mediaUrl}</span>
                  )}
                </TableCell>
                <TableCell className="px-2 text-sm font-normal text-gray-600">
                  <span>{formatDate(media.createdAt)}</span>
                </TableCell>
                <TableCell className="px-2 py-3 text-gray-500 text-theme-sm text-center">
                  {isEditMode && selectedMedia?._id === media._id ? (
                    <div className="flex gap-5 justify-center">
                      <button
                        onClick={handleCancel}
                        className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1"
                      >
                        <Icon icon="lucide:circle-x" width="20" height="20" />
                      </button>
                      <button
                        onClick={handleSave}
                        className="text-sm cursor-pointer font-medium text-center text-blue-600 hover:underline py-1 sm:py-1"
                      >
                        <Icon icon="lucide:save" width="20" height="20" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isEditMode ? (
                        <button
                          disabled
                          className="text-sm font-medium text-center text-gray-400 mx-auto hover:underline py-1 sm:py-1"
                        >
                          <Icon icon="lucide:edit" width="20" height="20" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetToEdit(media)}
                          className="text-sm cursor-pointer font-medium text-center text-blue-600 mx-auto hover:underline py-1 sm:py-1"
                        >
                          <Icon icon="lucide:edit" width="20" height="20" />
                        </button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
