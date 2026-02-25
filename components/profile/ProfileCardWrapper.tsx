"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileMetaCard from "./ProfileMetaCard";
import { fetchProfile } from "@/lib/actions/profileActions";
import { User } from "@/types/models";
import Skeleton from "../common/Skeleton";
import { toast } from "react-toastify";

export default function ProfileCardWrapper() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const loadProfile = async () => {
    setLoading(true);
    const result = await fetchProfile();
    if (result.success) {
      setProfile(result.data);
    }
    setLoading(false);
  };

  const reloadProfile = useCallback(async () => {
    setLoading(true);
    const result = await fetchProfile();
    if (result.success) {
      setProfile(result.data);
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
        />
        <ProfileInfoCard
          profileData={profile}
          loadProfileAfterSaveAction={reloadProfile}
        />
      </div>
    </div>
  );
}
