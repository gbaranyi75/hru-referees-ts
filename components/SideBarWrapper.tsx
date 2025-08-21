import SideBar from "./SideBar";
import { getSessionUser } from "@/lib/utils/getSessionUser";

const SideBarWrapper = async () => {
  const { user } = await getSessionUser();
  const role = user ? user?.publicMetadata?.role : "guest" as const;

  return <SideBar role={role} />;
};

export default SideBarWrapper;
