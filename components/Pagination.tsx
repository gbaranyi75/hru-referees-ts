"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";

interface PaginationProps {
  itemsPerPage: number;
  itemsLength: number;
}

const Pagination: FC<PaginationProps> = ({ itemsPerPage, itemsLength }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = window.location.pathname;

  const currentPage = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? itemsPerPage;
  const totalPages = Math.ceil(itemsLength / Number(per_page));
  const hasPrev = itemsPerPage * (Number(currentPage) - 1) > 0;
  const hasNext =
    itemsPerPage * (Number(currentPage) - 1) + itemsPerPage < itemsLength;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${pathName}?${params}` as Route);
  };

  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + Math.max(Number(currentPage) - 1, 1)
  );
  
  return (
    <div className="flex gap-2 mx-auto w-full justify-between items-center p-4 mt-4">
      <button
        className="flex cursor-pointer items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 text-sm"
        disabled={!hasPrev}
        onClick={() => {
          changePage(Number(currentPage) - 1);
        }}>
        Előző
      </button>
      <div className="flex items-center gap-2">
        {Array.from(
          { length: Math.ceil(itemsLength / itemsPerPage) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={pageIndex}
                onClick={() => changePage(pageIndex)}
                className={`px-4 py-2 rounded ${
                  Number(currentPage) === pageIndex
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                } flex w-10 cursor-pointer items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        className="flex cursor-pointer items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 text-sm"
        disabled={!hasNext}
        onClick={() => {
          changePage(Number(currentPage) + 1);
        }}>
        Következő
      </button>
    </div>
  );
};

export default Pagination;
