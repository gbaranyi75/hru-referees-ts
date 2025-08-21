"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import OutlinedButton from "@/components/common/OutlinedButton";
import Spinner from "./common/Spinner";
import MatchItem from "./MatchItem";
import MatchItemEdit from "./MatchItemEdit";
import useMatches from "@/hooks/useMatches";
import useCurrentUser from "@/hooks/useCurrentUser";

const MatchesEdit = () => {
  const { matches, loading } = useMatches();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathName = usePathname();
  const [isEditMode, setIsEditMode] = useState(false);

  const exitEditMode = () => {
    router.push("/dashboard/matches");
  };

  const toggleOpen = (id) => () =>
    setIsOpen((isOpen) => (isOpen === id ? null : id));

  const setToEdit = () => setIsEditMode(!isEditMode);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <section>
      {!isEditMode && (
        <div className="w-full mb-5">
          {matches &&
            matches.map((data, index) => (
              <MatchItem
                key={index}
                match={data}
                isAdmin={isAdmin}
                isOpen={isOpen === index}
                toggle={toggleOpen(index)}
                setToEdit={setToEdit}
              />
            ))}
          <div className="px-4 py-3 my-8 text-center sm:px-6">
            {isAdmin && pathName === "/dashboard/matches/edit" && (
              <OutlinedButton
                text={"Vissza"}
                type={"button"}
                onClick={exitEditMode}
              />
            )}
          </div>
        </div>
      )}
      {isEditMode && <MatchItemEdit />}
    </section>
  );
};

export default MatchesEdit;
