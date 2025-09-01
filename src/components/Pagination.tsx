import type { PaginationProps } from "../types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-row justify-end items-center space-x-2">
      <button className="rounded-md h-7 py-1 px-2 text-[#A1A1AA] text-[13px] text-nowrap font-medium hover:bg-[#3F3F46] transition-colors cursor-pointer">
        Page {currentPage} of {totalPages}
      </button>

      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`rounded-md py-1 h-7  px-2 text-[13px] font-medium  transition-colors  ${
          currentPage === 1
            ? "cursor-not-allowed text-[#52525B]"
            : "text-[#A1A1AA] cursor-pointer hover:bg-[#3F3F46]"
        }`}
      >
        Previous
      </button>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`rounded-md py-1 h-7 px-2 text-[13px] font-medium  transition-colors  ${
          currentPage === totalPages
            ? "cursor-not-allowed text-[#52525B]"
            : "text-[#A1A1AA] cursor-pointer hover:bg-[#3F3F46]"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
