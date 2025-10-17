"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProfileInfoCard from "@/components/ProfileInfoCard";
import ProfileMetaCard from "@/components/ProfileMetaCard";
import { fetchProfile } from "@/lib/actions/fetchProfile";
import { User } from "@/types/types";
import Skeleton from "./common/Skeleton";
import { toast } from "react-toastify";

export default function ProfileCardWrapper() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAfterSave, setIsAfterSave] = useState<boolean>(false);
  const loadProfile = async () => {
    setLoading(true);
    const loggedInUserData = await fetchProfile();
    if (loggedInUserData) {
      setProfile(loggedInUserData);
    }
    setLoading(false);
  };

  const reloadProfile = useCallback(async () => {
    setLoading(true);
    const loggedInUserData = await fetchProfile();
    if (loggedInUserData) {
      setProfile(loggedInUserData);
      toast.success("Sikeres mentés");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading)
    return (
      <div className="grid gap-4 mt-5">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-76" />
      </div>
    );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 mt-5">
      <div className="space-y-6">
        <ProfileMetaCard
          profileData={profile}
          loadProfileAfterSaveAction={reloadProfile}
          //setIsSuccess={setIsAfterSave} // This should be fine as it is now
        />
        <ProfileInfoCard
          profileData={profile}
          loadProfileAfterSaveAction={reloadProfile}
          //setIsAfterSave={setIsAfterSave} // Pass the setter function correctly
        />
      </div>
    </div>
  );
}
