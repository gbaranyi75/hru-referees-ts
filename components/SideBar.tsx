"use client";
import React, { useEffect, useState } from "react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_LINKS, NAV_LINKS, PROFILE_LINKS } from "@/lib/utils/links";
import { Icon } from "@iconify/react";
import { useUser } from "@clerk/nextjs";
import { NavItem } from "@/types/types";
import NavbarLogo from "./NavbarLogo";
import Footer from "./Footer";

const SideBar = ({ isAdmin }: { isAdmin: boolean }) => {
  const { isSignedIn } = useUser();

  return (
    <aside className="fixed top-0 left-0 h-screen hidden lg:block overflow-hidden overflow-y-auto lg:w-[290px] bg-white border-gray-300 border-r shadow-lg z-10">
      <nav className="flex flex-col w-full min-h-screen">
        <div className="flex-grow">
          <div className="flex px-4">
            <NavbarLogo />
          </div>
          <div className="py-0 mb-4 border-b-1 border-gray-300"></div>

          {/* Public NAV items */}
          <ul className="flex flex-col grow px-4 justify-between gap-1">
            {NAV_LINKS.map((item, idx) => {
              return (
                <li key={idx}>
                  <SideNavItem key={idx} item={item} />
                </li>
              );
            })}
            <li className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"></li>

            {/* Private NAV items */}
            {isSignedIn &&
              PROFILE_LINKS.map((item, idx) => {
                return (
                  <li key={idx}>
                    <SideNavItem key={idx} item={item} />
                  </li>
                );
              })}
            {isSignedIn && (
              <li className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"></li>
            )}

            {/* Facebook links */}
            <li>
              <Link
                href="https://www.facebook.com/groups/513219272190437"
                target="_blank"
                rel="noreferrer"
                className={
                  "flex flex-row space-x-3 text-gray-600 text-center text-sm items-center p-2 rounded-lg hover:bg-zinc-200"
                }
              >
                <Icon icon="lucide:facebook" width="20" height="20" />
                <span>MRGSZ JB zárt csoport</span>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.facebook.com/MRGSZ"
                target="_blank"
                rel="noreferrer"
                className={
                  "flex flex-row space-x-3 text-gray-600 text-center text-sm items-center p-2 rounded-lg hover:bg-zinc-200"
                }
              >
                <Icon icon="lucide:facebook" width="20" height="20" />
                <span>MRGSZ</span>
              </Link>
            </li>

            {/* Admin links */}
            {isAdmin && (
              <>
                <li className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"></li>

                {ADMIN_LINKS.map((item, idx) => {
                  return (
                    <li key={idx}>
                      <SideNavItem key={idx} item={item} />
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
        <div>
          <Footer />
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;

const SideNavItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const isActive = item?.path === pathname;
  const isSubMenuItemActive = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (subMenuOpen === true && !isSubMenuItemActive) {
      setSubMenuOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {item.subItems ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row w-full p-2 mb-1 space-x-3 text-center text-sm text-gray-600 items-center rounded-lg hover:bg-zinc-200
            ${subMenuOpen ? "text-indigo-700 bg-blue-100" : "bg-white"}`}
          >
            {item.icon}
            <span>{item.label}</span>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="20" height="20" />
            </div>
          </button>

          {subMenuOpen && (
            <ul className="flex flex-col space-y-2 gap-1">
              {item.subItems?.map((subItem, idx) => {
                return (
                  <li key={idx} className="m-0 ml-8">
                    <Link
                      href={subItem.path as Route}
                      className={`flex flex-row w-full p-2 space-x-3 text-center text-sm text-gray-600 items-center rounded-lg hover:bg-zinc-200
                      ${subItem.path === pathname ? "text-indigo-700 bg-blue-100" : "bg-white"}`}
                    >
                      <span>{subItem.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={(item.path as Route) || ""}
          className={`flex flex-row w-full p-2 space-x-3 text-center text-sm text-gray-600 items-center rounded-lg hover:bg-zinc-200
          ${isActive ? "text-indigo-700 bg-blue-100" : "bg-white"}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      )}
    </>
  );
};
