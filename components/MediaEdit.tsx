"use client";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import MediaEditList from "./MediaEditList";
import Input from "@/components/common/InputField";
import Label from "@/components/common/Label";
import DisabledButton from "./common/DisabledButton";
import OutlinedButton from "./common/OutlinedButton";
import Skeleton from "./common/Skeleton";
import PrimaryButton from "./common/PrimaryButton";
import { createNewMediaLink } from "@/lib/actions/createNewMediaLink";
import { fetchMedia } from "@/lib/actions/fetchMedia";
import { Media } from "@/types/types";

export default function MediaEdit() {
  const [loading, setLoading] = useState<boolean>(true);
  const [editModeOpen, setEditModeOpen] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const [mediaName, setMediaName] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [mediaList, setMediaList] = useState<Media[]>([]);

  const toggleEditMode = () => {
    setEditModeOpen(!editModeOpen);
    resetToDefault();
  };

  const handleMediaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setMediaName(e.target.value);
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      setEdited(true);
    }
    setVideoUrl(e.target.value);
  };

  const toggleCreateNew = () => {
    setEditModeOpen(!editModeOpen);
    resetToDefault();
  };

  const resetToDefault = () => {
    setEdited(false);
    setMediaName("");
    setVideoUrl("");
  };

  const handleSave = useCallback(async () => {
    if (mediaName === "" || videoUrl === "") {
      toast.error("Kérlek, tölts ki minden kötelezŐ mezőt");
      return;
    }
    if (!videoUrl.startsWith("http") && !videoUrl.startsWith("https")) {
      toast.error("Az URL nem megfelelő");
      return;
    }

    try {
      const res = await createNewMediaLink(mediaName, videoUrl);
      const success = res instanceof Error ? false : res.success;
      if (success) {
        toast.success("Sikeres mentés");
        resetToDefault();
        toggleCreateNew();
        getMedia();
      }
    } catch (error) {
      console.error(error);
    }
  }, [mediaName, videoUrl]);

  const getMedia = async () => {
    try {
      setLoading(true);
      const result = await fetchMedia();
      if (!result.success) return null;
      let sortedMedia: Media[] = result.data.sort((a: Media, b: Media) => {
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
      <div className="flex flex-col mb-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-end">
          <button
            onClick={toggleEditMode}
            className="flex w-full items-center justify-center gap-2 rounded-full border mb-4 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
          >
            <Icon icon="lucide:plus" width="20" height="20" />
            {editModeOpen ? "Mégsem" : "Új videó feltöltése"}
          </button>
        </div>
        {editModeOpen && (
          <>
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 xl:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="videoName">Név:</Label>
                <Input
                  type="text"
                  id="videoName"
                  defaultValue={""}
                  onChange={handleMediaNameChange}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="videoUrl">Média URL:</Label>
                <Input
                  type="text"
                  id="videoUrl"
                  defaultValue={""}
                  onChange={handleVideoUrlChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 justify-center lg:justify-end">
              <div className="px-4 py-3 text-center sm:px-6">
                <OutlinedButton
                  text={"Mégse"}
                  type={"button"}
                  onClick={toggleCreateNew}
                />
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                {edited ? (
                  <PrimaryButton onClick={handleSave} text="Mentés" />
                ) : (
                  <DisabledButton text={"Mentés"} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {loading ? (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-18 mb-2" />
          ))}
        </>
      ) : (
        <MediaEditList mediaList={mediaList} loadMediaAction={getMedia} />
      )}
    </div>
  );
}
