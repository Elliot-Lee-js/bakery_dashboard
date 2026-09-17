"use client";

import { Cost } from "@/db/schema";
import { useMemo, useState, useEffect } from "react";

const headers = [
    {id: "1", label: "Date"},
    {id: "2", label: "Description"},
    {id: "3", label: "Category"},
    {id: "4", label: "Cost"},
]

const ROWS_PER_PAGE = 10;

interface costTableProps {
  data: Cost[];
  startDate?: string;
  endDate?: string;
  showBorder?: boolean;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const CostTable = ({ data, startDate, endDate, showBorder = true }: costTableProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const diff = a.date.getTime() - b.date.getTime();
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [data, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ROWS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [data, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return sortedData.slice(start, start + ROWS_PER_PAGE);
  }, [sortedData, currentPage]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const totalCost = data.reduce((sum, item) => sum + Number(item.amount), 0);
  const dateRangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : startDate
      ? `From ${formatDate(startDate)}`
      : endDate
      ? `Up to ${formatDate(endDate)}`
      : "All dates";

  return (
    <div className={`p-4 bg-white rounded-md ${showBorder ? "border border-gray-300" : "border-none"}`}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold tracking-wide">Cost Breakdown</h1>
          <span className="text-sm text-gray-500">{dateRangeLabel}</span>
        </div>
            <table className="bg-white border border-gray-200 w-full">
                <thead>
                    <tr className="text-left">
                        {headers.map((header) =>
                          header.label === "Date" ? (
                            <th
                              key={header.id}
                              className="p-2 border cursor-pointer select-none"
                              onClick={toggleSortOrder}
                            >
                              {header.label} {sortOrder === "asc" ? "↑" : "↓"}
                            </th>
                          ) : (
                            <th className="p-2 border" key={header.id}>{header.label}</th>
                          )
                        )}
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="border border-gray-300 p-4 text-center text-gray-500">
                          No costs found in this date range.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-100">
                          <td className="px-2 py-1 border">{item.date.toLocaleDateString("en-AU")}</td>
                          <td className="px-2 py-1 border">{item.name}</td>
                          <td className="px-2 py-1 border">{item.category}</td>
                          <td className="px-2 py-1 border text-right">${Number(item.amount).toFixed(2)}</td>
                        </tr>
                      ))
                    )}

                         <tr className="bg-gray-100 font-bold">
                            <td className="border border-gray-300 p-2" colSpan={3}>
                                Total
                            </td>
                            <td className="border border-gray-300 p-2 text-right">
                               ${totalCost.toFixed(2)}
                            </td>
                        </tr>
                </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-gray-500">
                  Page {currentPage} of {totalPages} ({sortedData.length} total)
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-2 py-1 border rounded-md ${
                        page === currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
    </div>
  )
}

export default CostTable