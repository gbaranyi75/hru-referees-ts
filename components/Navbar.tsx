import NavbarProfileLinks from "./NavbarProfileLinks";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopWelcomeMsg from "./NavbarDesktopWelcomeMsg";
import NotificationDropdown from "./NotificationDropdown";
import { checkUser } from "@/lib/utils/checkUser";
import { fetchProfile } from "@/lib/actions/fetchProfile";

const Navbar = async () => {
  await checkUser();
  const result = await fetchProfile();
  const loggedInUser = result.success ? result.data : null;

  return (
    <nav className="sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-300 bg-white">
      <div className="mx-auto max-w-full">
        <div className="relative flex h-16 items-center justify-between">
          {/* <div className="h-14 w-14"></div> */}
          <div className="flex flex-1 items-center pl-14 justify-center md:items-stretch md:justify-start">
            <div className="md:hidden">
              <NavbarLogo />
            </div>
            {loggedInUser && (
              <div>
                <NavbarDesktopWelcomeMsg loggedInUser={loggedInUser} />
              </div>
            )}
          </div>
          <div className="flex h-14 w-14 w-max items-center justify-center md:pr-12 space-x-5">
            {loggedInUser?.clerkUserId && (
              <NotificationDropdown clerkUserId={loggedInUser.clerkUserId} />
            )}
            <NavbarProfileLinks loggedInUser={loggedInUser} />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
