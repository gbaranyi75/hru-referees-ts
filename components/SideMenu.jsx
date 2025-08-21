"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTable, FaFootballBall, FaVideo, FaUsers } from "react-icons/fa";

const SideMenu = () => {
  const pathname = usePathname();

  return (
    <div className="mb-1 h-full px-3 overflow-y-auto border-r-2">
      <ul className="space-y-2 font-medium">
        <li>
          <div className="w-full mb-1 px-4 md:px-0 text-center">
            <Link
              className={`${
                pathname === "/dashboard/calendar" ? "bg-gray-200" : "bg-white"
              } w-full items-center inline-flex py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-md`}
              href="/dashboard/calendar"
            >
              <FaTable color="gray" size={20} className="mx-3" />
              <span>Táblázatok</span>
            </Link>
          </div>
        </li>
        <li>
          <div className="w-full mb-1 px-4 md:px-0 text-center">
            <Link
              className={`${
                pathname === "/dashboard/matches" ? "bg-gray-200" : "bg-white"
              } w-full items-center inline-flex py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-md`}
              href="/dashboard/matches"
            >
              <FaFootballBall color="gray" size={20} className="mx-3" />
              <span>Mérkőzések</span>
            </Link>
          </div>
        </li>
        <li>
          <div className="w-full mb-1 px-4 md:px-0 text-center">
            <Link
              className={`${
                pathname === "/" ? "bg-gray-200" : "bg-white"
              } w-full items-center inline-flex py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-md`}
              href="/merkozesek"
            >
              <FaUsers color="gray" size={20} className="mx-3" />
              <span>Játékvezetők</span>
            </Link>
          </div>
        </li>
        <li>
          <div className="w-full mb-1 px-4 md:px-0 text-center">
            <Link
              className={`${
                pathname === "/merkozesek" ? "bg-gray-200" : "bg-white"
              } w-full items-center inline-flex py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-md`}
              href="/merkozesek"
            >
              <FaVideo color="gray" size={20} className="mx-3" />
              <span>Videók</span>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
