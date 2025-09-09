"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Variants, motion, useCycle } from "framer-motion";
import { ADMIN_LINKS, NAV_LINKS, PROFILE_LINKS } from "@/lib/utils/links";
import { NavItem } from "@/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUser } from "@clerk/nextjs";

const sidebar: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute left-4 top-[23px] z-30"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const NavbarMobileMenu = ({ role }: { role: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const { isSignedIn } = useUser();

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`fixed inset-0 z-50 w-full md:hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-white"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto"
      >
        {NAV_LINKS.map((item, idx) => {
          return (
            <motion.div key={idx}>
              <SideNavItem key={idx} item={item}  toggle={toggleOpen}/>
            </motion.div>
          );
        })}
        <motion.li
          variants={MenuItemVariants}
          className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"
        ></motion.li>
        {isSignedIn &&
          PROFILE_LINKS.map((item, idx) => {
            return (
              <div key={idx}>
                <SideNavItem key={idx} item={item}  toggle={toggleOpen}/>
              </div>
            );
          })}
        {isSignedIn && (
          <motion.li
            variants={MenuItemVariants}
            className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"
          ></motion.li>
        )}

        {/* Facebook links */}
        <motion.li variants={MenuItemVariants}>
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
        </motion.li>
        <motion.li variants={MenuItemVariants}>
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
        </motion.li>

        {/* Admin links */}
        {role === "admin" && (
          <>
            <motion.li
              variants={MenuItemVariants}
              className="py-0 pt-1 m-0 mb-2 border-b-1 border-gray-300"
            ></motion.li>

            {ADMIN_LINKS.map((item, idx) => {
              return (
                <div key={idx}>
                  <SideNavItem key={idx} item={item} toggle={toggleOpen}/>
                </div>
              );
            })}
          </>
        )}
      </motion.ul>
      <MenuToggle toggle={toggleOpen} />
    </motion.nav>
  );
};

const SideNavItem = ({
  item,
  className,
  toggle,
}: {
  item: NavItem;
  className?: string;
  toggle?: any;
}) => {
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
    <motion.li variants={MenuItemVariants} className={className}>
      <div>
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
              <motion.ul className="flex flex-col space-y-2 gap-1">
                {item.subItems?.map((subItem, idx) => {
                  return (
                    <motion.li key={idx} className="m-0 ml-8">
                      <Link
                        href={subItem.path}
                        onClick={toggle}
                        className={`flex flex-row w-full p-2 space-x-3 text-center text-sm text-gray-600 items-center rounded-lg hover:bg-zinc-200
                      ${subItem.path === pathname ? "text-indigo-700 bg-blue-100" : "bg-white"}`}
                      >
                        <span>{subItem.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </>
        ) : (
          <Link
            href={item.path || ""}
            onClick={toggle}
            className={`flex flex-row w-full p-2 space-x-3 text-center text-sm text-gray-600 items-center rounded-lg hover:bg-zinc-200
          ${isActive ? "text-indigo-700 bg-blue-100" : "bg-white"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )}
      </div>
    </motion.li>
  );
};

export default NavbarMobileMenu;
