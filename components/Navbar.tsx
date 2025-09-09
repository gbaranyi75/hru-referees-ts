import { checkUser } from "@/lib/utils/checkUser";
import NavbarProfileLinks from "./NavbarProfileLinks";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopWelcomeMsg from "./NavbarDesktopWelcomeMsg";
import { fetchProfile } from "@/lib/actions/fetchProfile";
import { convertToJSON } from "@/lib/utils/convertToJSON";

const Navbar = async () => {
  await checkUser();
  const loggedInUserData = await fetchProfile();
  const loggedInUser = convertToJSON(loggedInUserData);

  return (
    <nav className="sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-300 bg-white">
      <div className="mx-auto max-w-full">
        <div className="relative flex h-16 items-center justify-between">
          {/* <div className="h-14 w-14"></div> */}
          <div className="flex flex-1 items-center pl-14 justify-center md:items-stretch md:justify-start">
            <div className="md:hidden">
              <NavbarLogo />
            </div>
            <div>
              <NavbarDesktopWelcomeMsg loggedInUser={loggedInUser}/>
            </div>
          </div>
          <div className="flex h-14 w-14 md:w-max items-center justify-center md:pr-12">
            <NavbarProfileLinks loggedInUser={loggedInUser} />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
