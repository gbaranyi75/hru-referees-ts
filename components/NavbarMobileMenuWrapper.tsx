import { getSessionUser } from "@/lib/utils/getSessionUser";
import NavbarMobileMenu from "./NavbarMobileMenu";

const NavbarMobileMenuWrapper = async () => {
  const { user } = await getSessionUser();
  const role = user ? user?.publicMetadata?.role : ("guest" as const);
  
  return <NavbarMobileMenu role={role}/>;
};

export default NavbarMobileMenuWrapper;
