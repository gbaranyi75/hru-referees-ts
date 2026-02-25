"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../common/Modal";
import Skeleton from "../common/Skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/common/DefaultTable";
import { Media } from "@/types/models";
import { useModal } from "@/hooks/useModal";
import { Icon } from "@iconify/react";
import { fetchMedia } from "@/lib/actions/mediaActions";
import { formatDate } from "@/lib/utils/formatUtils";
import Link from "next/link";
import { Route } from "next";
import EmbeddedMedia from "./EmbeddedMedia";

const YOUTUBE_BASE_URL = "https://www.youtube.com/embed/";

const VideoList = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState<boolean>(true);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [videoId, setVideoId] = useState<string>("");

  const handleSelectedMedia = (media: Media) => {
    //setSelectedMedia(media);
    //setVideoId(media.mediaUrl.split("?v=")[1]);
    getVideoId(media.mediaUrl);
    openModal();
  };

  const getVideoId = (url: string) => {
    setVideoId(url.split("?v=")[1]);
  };

  const getMedia = async () => {
    try {
      setLoading(true);
      const result = await fetchMedia();
      if (!result.success) return null;
      const sortedMedia: Media[] = result.data.sort((a: Media, b: Media) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setMediaList(sortedMedia);
      setLoading(false);
      return sortedMedia;
    } catch (error) {
      console.error(error);
      return new Error(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  if (loading)
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full h-12 mb-2"
          />
        ))}
      </>
    );

  return (
    <>
      <div className="overflow-hidden rounded-xl mt-1 border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full table-auto">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-gray-50">
              <TableRow className="text-sm text-center">
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 w-41.5">
                  Név
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 w-41.5">
                  URL
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 w-41.5">
                  Létrehozva
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 w-41.5">
                  Megtekintés
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100">
              {mediaList.map((m) => (
                <TableRow
                  key={m._id}
                  className="text-sm text-center h-16">
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {m.name}
                  </TableCell>
                  <TableCell className="px-2 font-normal text-blue-500 underline">
                    <Link
                      href={m.mediaUrl as Route}
                      target="_blank">
                      {m.mediaUrl}
                    </Link>
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {formatDate(m.createdAt)}
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    <button
                      onClick={() => handleSelectedMedia(m)}
                      className="cursor-pointer text-blue-600 my-auto">
                      <Icon
                        icon="lucide:eye"
                        width="20"
                        height="20"
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={true}
        className="max-w-[80%] p-0 overflow-hidden">
        <EmbeddedMedia url={`${YOUTUBE_BASE_URL}${videoId}`} />
      </Modal>
    </>
  );
};

export default VideoList;
