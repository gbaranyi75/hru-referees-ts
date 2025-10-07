import SideBar from "./SideBar";
import { Suspense } from "react";
import Skeleton from "./common/Skeleton";
import { checkRole } from "@/lib/utils/roles";

const SideBarWrapper = async () => {
  const isAdmin = await checkRole('admin')

  return (
    <Suspense fallback={<Skeleton className="h-12" />}>
      <SideBar isAdmin={isAdmin} />
    </Suspense>
  );
};

export default SideBarWrapper;
