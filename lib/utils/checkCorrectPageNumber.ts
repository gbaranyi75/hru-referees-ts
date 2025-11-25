    export function checkCorrectPageNumber(searchParams: URLSearchParams, totalPages: number): number {
      return Number(searchParams.get("page")) > totalPages ||
        Number(searchParams.get("page")) < 1 ||
        !searchParams.get("page")
          ? 1
          : Number(searchParams.get("page"));
    }