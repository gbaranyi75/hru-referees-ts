import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./common/table";

import Image from "next/image";
import { User } from "@/types/types";
import Link from "next/link";

export default function RefereesTable({ referees }: { referees: User[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100">
              <TableRow className="">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs"
                >
                  Név
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs"
                >
                  Email
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Team
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell> */}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs"
                >
                  Adatlap
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100">
              {referees.map((ref) => (
                <TableRow key={ref.clerkUserId}>
                  <TableCell className="px-2 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-6">
                      <Image
                        width={40}
                        height={40}
                        src={ref.image}
                        alt={ref.username}
                        className="w-10 h-10 rounded-full object-contain"
                      />
                      <div className="block text-sm font-normal text-gray-600 text-theme-s">
                        {ref.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {ref.email}
                  </TableCell>

                  <TableCell className="px-2 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Link
                      href="#"
                      type="button"
                      data-modal-target="editUserModal"
                      data-modal-show="editUserModal"
                      className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline px-4 py-1 sm:py-1 w-24"
                    >
                      Adatlap
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
