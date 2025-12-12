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
import { Dropdown } from "./common/Dropdown";
import Link from "next/link";
import { DropdownItem } from "./common/DropdownItem";
import { User } from "@/types/types";
const NavbarProfileLinks = ({ loggedInUser }: { loggedInUser: User | null }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingComponent text={""} textColor={"text-gray-200"} />;
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <div className="flex text-md mr-6 cursor-pointer items-center text-gray-600">
            <Icon icon="lucide:log-in" width="20" height="20" color="gray" />
            <span className="hidden md:block ml-2">
              Belépés vagy regisztráció
            </span>
          </div>
        </SignInButton>
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
              <NavbarUserIcon
                image={loggedInUser?.image || undefined}
                username={loggedInUser?.username || undefined}
              />
            </button>
          </div>

          {/* <!-- Profile dropdown --> */}
          <Dropdown
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            className="absolute right-0 mt-[9px] top-10 flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg"
          >
            <div>
              <span className="block font-bold text-gray-600 text-xs">
                {loggedInUser?.username}
              </span>
              <span className="mt-0.5 block text-xs text-gray-400">
                {loggedInUser?.email}
              </span>
            </div>
            <ul className="flex flex-col gap-1 pt-3 pb-3 border-b border-gray-200">
              <li>
                <DropdownItem
                  onItemClick={() => setIsProfileMenuOpen(false)}
                  tag="a"
                  href="/profil"
                  className="flex items-center gap-3 px-3 py-1 font-medium text-gray-600 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700"
                >
                  <Icon
                    icon="lucide:user-round"
                    width="20"
                    height="20"
                    color="gray"
                  />
                  <span className="text-gray-600">Profil</span>
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={() => setIsProfileMenuOpen(false)}
                  tag="a"
                  href="/jv-elerhetoseg"
                  className="flex items-center gap-3 px-3 py-1 font-medium text-gray-600 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700"
                >
                  <Icon
                    icon="lucide:calendar-days"
                    width="20"
                    height="20"
                    color="gray"
                  />
                  <span className="text-gray-600">Elérhetőség megadása</span>
                </DropdownItem>
              </li>
            </ul>
            <SignOutButton redirectUrl="/">
              <div className="flex flex-col gap-1 pt-3">
                <div className="flex items-center gap-3 px-4 py-2 font-medium text-gray-600 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700">
                  <Icon
                    icon="lucide:log-out"
                    width="20"
                    height="20"
                    color="gray"
                  />
                  <Link
                    href="/"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Kijelentkezés
                  </Link>
                </div>
              </div>
            </SignOutButton>
          </Dropdown>
        </div>
      </SignedIn>
    </>
  );
};

export default NavbarProfileLinks;
