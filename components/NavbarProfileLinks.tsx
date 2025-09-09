"use client";
import { useState } from "react";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import LoadingComponent from "./common/LoadingComponent";
import NavbarUserIcon from "./NavbarUserIcon";
const NavbarProfileLinks = ({ loggedInUser }: { loggedInUser: any }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingComponent text={""} textColor={"text-gray-200"} />;
  }

  return (
    <>
      <SignedOut>
        <div className="">
          <SignInButton mode="modal">
            <div className="flex text-md mr-6 cursor-pointer items-center text-gray-600">
              <Icon icon="lucide:log-in" width="20" height="20" color="gray" />
              <span className="hidden md:block ml-2">
                Belépés vagy regisztráció
              </span>
            </div>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center relative">
          <div className="flex items-center text-gray-600">
            <button
              type="button"
              className="flex rounded-full cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-white"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              <span className=" -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <NavbarUserIcon image={loggedInUser?.image} username={loggedInUser?.username}/>
            </button>
          </div>

          {/* <!-- Profile dropdown --> */}
          {isProfileMenuOpen && (
            <div
              id="user-menu"
              className="absolute right-0 top-10 z-10 w-44 items-center justify-center origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
            >
              <SignOutButton redirectUrl="/">
                <div className="flex items-center justify-center">
                  <Icon
                    icon="lucide:log-out"
                    width="20"
                    height="20"
                    color="gray"
                  />
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                    }}
                    className="block px-2 py-3 cursor-pointer md:py-2 text-sm text-gray-600"
                  >
                    Kijelentkezés
                  </button>
                </div>
              </SignOutButton>
            </div>
          )}
        </div>
      </SignedIn>
    </>
  );
};

export default NavbarProfileLinks;
