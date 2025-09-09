import SideBar from "./SideBar";
import { getSessionUser } from "@/lib/utils/getSessionUser";
import { Suspense } from "react";
import Skeleton from "./common/Skeleton";

const SideBarWrapper = async () => {
  const { user } = await getSessionUser();
  const role = user ? user?.publicMetadata?.role : ("guest" as const);

  return (
    <Suspense fallback={<Skeleton className="h-12" />}>
      <SideBar role={role} />
    </Suspense>
  );
};

export default SideBarWrapper;
