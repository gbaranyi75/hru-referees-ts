"use client";
import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import OutlinedButton from "./common/OutlinedButton";
import PrimaryButton from "./common/PrimaryButton";
import { toast } from "react-toastify";
import Spinner from "./common/Spinner";
import LoadingComponent from "@/components/common/LoadingComponent";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { updateProfileImage } from "@/lib/actions/updateProfileImage";
import { updateUserName } from "@/lib/actions/updateUserName";
import { User } from "@/types/types";
import { fetchProfile } from "@/lib/actions/fetchProfile";
import profileImage from "@/assets/images/profile-image.png";

const Profile = () => {
  const { isLoaded, user } = useUser();
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState<User | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [dbImageUrl, setDbImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");

  const fetchProfileData = async () => {
    const loggedInUserData = await fetchProfile();
    setUserName(loggedInUserData?.username);
    setProfile(loggedInUserData);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUserNameChange = useCallback(async () => {
    const res = await updateUserName(userName);
    if (res) {
      toast.success("Sikeres mentés");
      fetchProfileData();
    }
  }, [userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleCancel = () => {
    setUserName(profile?.username || "");
  };

  const handleImageUpload = useCallback(async (result: any) => {
    const info = result.info as any;
    const url = info.secure_url as string;
    const public_id = info.public_id as string;
    setImageUrl(url);
    setPublicId(public_id);
    const res = await updateProfileImage(url);
    if (res) {
      //setDbImageUrl(res.image);
      toast.success("Sikeres mentés");
      //setTimeout(() => window.location.reload(), 2500);
    }
  }, []);

  if (!isLoaded) return <Spinner />;

  return (
    <div className="bg-white max-w-5xl mx-2 md:mx-auto px-10 py-12 mt-6 md:mt-10 shadow-md rounded-md border">
      <div className="flex flex-col md:flex-row">
        <div className="w-2/3 md:w-2/3 mx-auto justify-center text-center">
          <div
            className="flex py-12 mx-auto mb-4 justify-center w-2/3 md:w-1/2"
            style={{ position: "unset" as "unset" }}
          >
            <Image
              className="rounded-full mx-auto relative object-contain w-[100%] aspect-square"
              src={profile?.image || profileImage}
              width={0}
              height={0}
              sizes="100vw"
              alt="User"
              priority={true}
            />
          </div>
          <h2 className="text-base mb-4">
            <span className="font-bold block">Név: </span> {profile?.username}
          </h2>
          <h2 className="text-base">
            <span className="font-bold block">Email: </span> {profile?.email}
          </h2>
        </div>
        <div className="w-full mt-5 md:mx-12  md:mt-0 bg-white md:text-left">
          <div className="shadow overflow-hidden sm:rounded-md">
            <form action="">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium ml-1 mb-2"
                    >
                      Név módosítása:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userName}
                      id="name"
                      autoComplete="name"
                      required
                      className="mt-1 px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-solid border border-indigo-50 rounded-md"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col-reverse md:flex-row-reverse justify-between mt-5">
                <div className="px-4 py-3 md:pr-16 text-center sm:px-6">
                  <PrimaryButton
                    type={"button"}
                    text={"Név mentése"}
                    onClick={handleUserNameChange}
                  />
                </div>

                <div className="px-4 py-3 md:pl-16 text-center sm:px-6">
                  <OutlinedButton
                    type={"button"}
                    text={"Mégsem"}
                    onClick={handleCancel}
                  />
                </div>
              </div>
            </form>
            <hr className="mt-10" />

            <div className="px-4 py-5 bg-white sm:p-6 mt-10">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium ml-1 mb-2"
                  >
                    Profilkép módosítása
                  </label>

                  <CldUploadButton
                    options={{ sources: ["local", "url", "camera"] }}
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-blue-700 hover:bg-blue-500"
                    onSuccessAction={handleImageUpload}
                  >
                    <span className="mr-2">
                      <Icon icon="lucide:image-up" width="20" height="20" />
                    </span>
                    Feltöltés
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
