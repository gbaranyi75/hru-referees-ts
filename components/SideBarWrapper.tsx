import SideBar from "./SideBar";
import { checkRole } from "@/lib/utils/roles";

const SideBarWrapper = async () => {
  const isAdmin = await checkRole("admin");

  return <SideBar isAdmin={isAdmin} />;
};

export default SideBarWrapper;
