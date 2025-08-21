"use client";
import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, PROFILE_LINKS } from "@/lib/utils/links";
import Link from "next/link";
import NavbarLogo from "./NavbarLogo";
import { Icon } from "@iconify/react";
import { useUser } from "@clerk/nextjs";
import { NavLink } from "@/types/types";
import LoadingPulseComponent from "./common/Skeleton";

const SideBar = ({ role }: { role: string }) => {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <div className="fixed top-0 left-0 h-full hidden md:block md:w-64 bg-white border-gray-300 border-r shadow-lg z-10">
      <div className="flex flex-col w-full">
        <div className="flex px-4">
          <NavbarLogo />
        </div>
        <div className="py-0 mb-4 border-b-1 border-gray-300"></div>
        <div className="flex grow justify-between flex-col">
          <div className="flex flex-col space-y-1 px-4">
            {NAV_LINKS.map((item, idx) => {
              return <SideNavItem key={idx} item={item} />;
            })}
            <div className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"></div>

            {isSignedIn &&
              PROFILE_LINKS.map((item, idx) => {
                return <SideNavItem key={idx} item={item} />;
              })}
            {isSignedIn && (
              <div className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"></div>
            )}

            <div className="w-full px-4 md:px-0 text-center text-sm">
              <Link
                href="https://www.facebook.com/groups/513219272190437"
                target="_blank"
                rel="noreferrer"
                className={
                  "flex flex-row space-x-3 text-gray-600 items-center p-2 rounded-lg hover:bg-zinc-200"
                }
              >
                <Icon icon="lucide:facebook" width="20" height="20" />
                <span>MRGSZ JB zárt csoport</span>
              </Link>
              <Link
                href="https://www.facebook.com/MRGSZ"
                target="_blank"
                rel="noreferrer"
                className={
                  "flex flex-row space-x-3 text-gray-600 items-center p-2 rounded-lg hover:bg-zinc-200"
                }
              >
                <Icon icon="lucide:facebook" width="20" height="20" />
                <span>MRGSZ</span>
              </Link>
            </div>
            {role === "admin" && (
              <>
                <div className="py-0 pt-1 border-b-1 border-gray-300"></div>
                <div className="w-full px-4 md:px-0 text-center text-sm">
                  <Link
                    href="/dashboard/calendar"
                    className={`flex flex-row space-x-3 text-gray-600 items-center p-2 rounded-lg hover:bg-zinc-200 ${
                      pathname === "/dashboard/calendar" ? "bg-zinc-200" : ""
                    }`}
                  >
                    <Icon
                      icon="lucide:layout-dashboard"
                      width="20"
                      height="20"
                    />
                    <span>Admin Dashboard</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

const SideNavItem = ({ item }: { item: NavLink }) => {
  const pathname = usePathname();
  const isActive = item.path === pathname;

  return (
    <>
      {NAV_LINKS ? (
        <Link
          href={item.path}
          className={`flex flex-row w-full p-2 space-x-3 text-center text-sm text-gray-600 items-center rounded-lg hover:bg-zinc-200
          ${isActive ? "bg-zinc-200" : "bg-white"}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ) : (
        <LoadingPulseComponent size="w-12" innerSize="w-12 h-6" />
      )}
    </>
  );
};
