interface IPaginationProps {
  itemsPerPage: number;
  itemsCount: number;
  currentPage: number;
  changePage: (newPage: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  itemsPerPage,
  itemsCount,
  currentPage,
  changePage,
}) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  const hasPrev = itemsPerPage * (currentPage - 1) > 0;
  const hasNext = itemsPerPage * (currentPage - 1) + itemsPerPage < itemsCount;

  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => {
      // Calculate the page number to show
      let page = (currentPage - 1) + i;

      // Only show if not first or last page
      if (page === 1 || page >= totalPages || page === 0) return null;
      return (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          } flex w-10 cursor-pointer px-4 py-2 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
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
          changePage(currentPage - 1);
        }}>
        Előző
      </button>

      {/* Buttons for paging */}
      <div className="flex items-center gap-2">
        <button
          key={1}
          onClick={() => changePage(1)}
          className={`${
            currentPage === 1
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          } flex w-10 cursor-pointer px-4 py-2 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
          1
        </button>
        {/* Ellipsis before pagesAroundCurrent */}
        {currentPage > 2 && totalPages > 4 && (
          <span className="px-3">...</span>
        )}
        {pagesAroundCurrent}
        {/* Ellipsis after pagesAroundCurrent */}
        {currentPage < totalPages - 2 && totalPages > 4 && (
          <span className="px-3">...</span>
        )}
        {/* Last page button */}
        {totalPages > 1 && (
          <button
            key={totalPages}
            onClick={() => changePage(totalPages)}
            className={`${
              currentPage === totalPages
                ? "bg-blue-500 text-white"
                : "text-gray-600"
            } flex w-10 px-4 py-2 cursor-pointer items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white`}>
            {totalPages}
          </button>
        )}
      </div>

      <button
        className="flex cursor-pointer items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 text-sm"
        disabled={!hasNext}
        aria-label="Next page"
        onClick={() => {
          changePage(currentPage + 1);
        }}>
        Következő
      </button>
    </div>
  );
};

export default Pagination;
