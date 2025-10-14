"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination(
    {
      currentPage,
      totalPages,
      onPageChange,
    }
    : PaginationProps) {

  const generatePagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null; // ページ数1なら非表示

  return (
      <div className="flex justify-center w-full mt-6 space-x-2">
        {currentPage > 1 && (
            <button
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              前へ
            </button>
        )}

        {generatePagination().map((page, index) => (
            <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white hover:bg-gray-500"
                }`}
            >
              {page}
            </button>
        ))}

        {currentPage < totalPages && (
            <button
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              次へ
            </button>
        )}
      </div>
  );
}
