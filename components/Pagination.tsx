"use client";

import { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Route } from "next";

interface PaginationProps {
  itemsPerPage: number;
  itemsLength: number;
}

const Pagination: FC<PaginationProps> = ({ itemsPerPage, itemsLength }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const currentPage = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? itemsPerPage;
  const totalPages = Math.ceil(itemsLength / Number(per_page));
  const hasPrev = Number(per_page) * (Number(currentPage) - 1) > 0;
  const hasNext =
    Number(per_page) * (Number(currentPage) - 1) + itemsPerPage < itemsLength;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${pathName}?${params}` as Route);
  };

  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => {
      // Calculate the page number to show
      let page = Number(currentPage) - 1 + i;

      // Only show if not first or last page
      if (page === 1 || page >= totalPages || page === 0) return null;
      return (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`px-4 py-2 rounded ${
            Number(currentPage) === page
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          } flex w-10 cursor-pointer items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
          {page}
        </button>
      );
    }
  );

  return (
    <div className="flex gap-2 mx-auto w-full justify-between items-center p-4 mt-4">
      <button
        className="flex cursor-pointer items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 text-sm"
        disabled={!hasPrev}
        aria-label="Previous page"
        onClick={() => {
          changePage(Number(currentPage) - 1);
        }}>
        Előző
      </button>

      {/* Buttons for paging */}
      <div className="flex items-center gap-2">
        <button
          key={1}
          onClick={() => changePage(1)}
          className={`px-4 py-2 rounded ${
            Number(currentPage) === 1
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          } flex w-10 cursor-pointer items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
          1
        </button>
        {/* Ellipsis before pagesAroundCurrent */}
        {Number(currentPage) > 2 && totalPages > 4 && (
          <span className="px-3">...</span>
        )}
        {pagesAroundCurrent}
        {/* Ellipsis after pagesAroundCurrent */}
        {Number(currentPage) < totalPages - 2 && totalPages > 4 && (
          <span className="px-3">...</span>
        )}
        {/* Last page button */}
        {totalPages > 1 && (
          <button
            key={totalPages}
            onClick={() => changePage(totalPages)}
            className={`px-4 py-2 rounded ${
              Number(currentPage) === totalPages
                ? "bg-blue-500 text-white"
                : "text-gray-600"
            } flex w-10 cursor-pointer items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
            {totalPages}
          </button>
        )}
      </div>

      <button
        className="flex cursor-pointer items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 text-sm"
        disabled={!hasNext}
        aria-label="Next page"
        onClick={() => {
          changePage(Number(currentPage) + 1);
        }}>
        Következő
      </button>
    </div>
  );
};

export default Pagination;
