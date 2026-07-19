import React from "react";

const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div className="flex space-x-2 mt-4">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-2 py-1 border ${p === page ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
