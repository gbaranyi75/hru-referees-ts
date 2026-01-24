"use client";
import { useState } from "react";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { Icon } from "@iconify/react";
import LoadingComponent from "./common/LoadingComponent";
import { Dropdown } from "./common/Dropdown";
import Link from "next/link";
import { DropdownItem } from "./common/DropdownItem";
import profileImage from "@/public/images/profile-image.png";
import { User } from "@/types/types";

const NavbarProfileLinks = ({
  loggedInUser,
}: {
  loggedInUser: User | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded } = useUser();

  const toggleDropdown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleItemClick = () => {
    closeDropdown();
  };

  const splittedUserName = loggedInUser?.username?.split(" ") || "";
  if (!isLoaded) {
    return (
      <LoadingComponent
        text={""}
        textColor={"text-gray-200"}
      />
    );
  }
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <div className="flex text-md mr-6 cursor-pointer items-center text-gray-600">
            <Icon
              icon="lucide:log-in"
              width="20"
              height="20"
              color="gray"
            />
            <span className="hidden md:block ml-2">
              Belépés vagy regisztráció
            </span>
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dropdown-toggle items-center">
            <span className="mr-3 overflow-hidden rounded-full h-10 w-10 items-center">
              <Image
                src={loggedInUser?.image || profileImage}
                alt="profilkép"
                width={60}
                height={60}
                sizes="100vw"
                priority
                style={{ objectFit: "cover" }}
              />
            </span>
            <span className="hidden md:block m-1 font-medium text-theme-sm">
              {splittedUserName.length < 2
                ? splittedUserName[0]
                : splittedUserName[1]}
            </span>
            <svg
              className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="absolute right-0 top-12 flex w-65 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg">
            <div>
              <span className="block font-bold text-gray-600 text-xs">
                {loggedInUser?.username}
              </span>
              <span className="mt-0.5 block text-xs text-gray-400">
                {loggedInUser?.email}
              </span>
            </div>
            {loggedInUser && (
              <ul className="flex flex-col gap-1 pt-3 pb-3 border-b border-gray-200 mb-3">
                <li>
                  <DropdownItem
                    onItemClick={handleItemClick}
                    tag="a"
                    href="/profil"
                    className="flex items-center gap-3 px-3 py-1 font-medium text-gray-600 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700">
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
                    onItemClick={handleItemClick}
                    tag="a"
                    href="/jv-elerhetoseg"
                    className="flex items-center gap-3 px-3 py-1 font-medium text-gray-600 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700">
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
            )}
            <SignOutButton redirectUrl="/">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-4 py-2 font-medium text-gray-600 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700">
                  <Icon
                    icon="lucide:log-out"
                    width="20"
                    height="20"
                    color="gray"
                  />
                  <Link
                    href="/"
                    onClick={closeDropdown}>
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
