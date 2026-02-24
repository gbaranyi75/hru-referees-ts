import NavbarMobileMenu from "./NavbarMobileMenu";
import { checkRole } from "@/lib/utils/roles";

const NavbarMobileMenuWrapper = async () => {
  const isAdmin = await checkRole("admin");

  return <NavbarMobileMenu isAdmin={isAdmin} />;
};

export default NavbarMobileMenuWrapper;
