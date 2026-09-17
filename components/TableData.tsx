"use client";

import { Product } from "@/db/schema";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

export const headers = [
  { id: "1", key: "Date", label: "Date" },
  { id: "2", key: "Product", label: "Product" },
  { id: "3", key: "Description", label: "Description" },
  { id: "4", key: "Price", label: "Price" },
  { id: "5", key: "Amount", label: "Amount" },
  { id: "6", key: "Revenue", label: "Revenue" },
];

const ROWS_PER_PAGE = 10;

interface TableDataProps {
  showBorder?: boolean;
  showApplyFilter?: boolean;
  productData: Product[];
  startDate?: string;
  endDate?: string;
}

const TableData = ({ showBorder = true, showApplyFilter = true, productData = [], startDate, endDate }: TableDataProps) => {

  const [localStart, setLocalStart] = useState(startDate ?? "");
  const [localEnd, setLocalEnd] = useState(endDate ?? "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
  return [...(productData ?? [])].sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return sortOrder === "asc" ? diff : -diff;
  });
}, [productData, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ROWS_PER_PAGE));

  // Reset to page 1 whenever the underlying data or sort order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [productData, sortOrder]);

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (localStart) params.set("startDate", localStart);
    else params.delete("startDate");

    if (localEnd) params.set("endDate", localEnd);
    else params.delete("endDate");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocalStart("");
    setLocalEnd("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("startDate");
    params.delete("endDate");
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalRevenue = productData.reduce((sum, item) => sum + Number(item.price) * item.amount, 0);
  const totalAmountSold = productData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className={`flex justify-center bg-white border ${showBorder ? 'border-gray-300' : 'border-0'} rounded-md p-4`}>
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-xl font-semibold tracking-wide">Revenue By Products</h1>

          {showApplyFilter && (<div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              From:
              <input
                type="date"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-1 text-sm">
              To:
              <input
                type="date"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </label>
            <button
              onClick={applyFilters}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
            {(localStart || localEnd) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>)}
        </div>

        <table className="w-full overflow-hidden">
          <thead>
            <tr>
              {headers.map((header) =>
                header.key === "Date" ? (
                  <th
                    key={header.id}
                    className="border border-gray-300 p-2 text-left cursor-pointer select-none"
                    onClick={toggleSortOrder}
                  >
                    {header.label} {sortOrder === "asc" ? "↑" : "↓"}
                  </th>
                ) : (
                  <th className="border border-gray-300 p-2 text-left" key={header.id}>
                    {header.label}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 p-4 text-center text-gray-500">
                  No products found in this date range.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const revenuePerItem = Number(item.price) * item.amount;
                return (
                  <tr key={item.id} className="hover:bg-blue-100 transition-colors">
                    <td className="border border-gray-300 px-2 py-1 font-medium">
                      {item.date.toLocaleDateString("en-AU")}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 font-medium">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-gray-600">
                      {item.description}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 font-medium">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 font-medium">
                      {item.amount}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 font-medium">
                      ${revenuePerItem.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}

            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 p-2" colSpan={4}>
                Total
              </td>
              <td className="border border-gray-300 p-2 text-right">{totalAmountSold}</td>
              <td className="border border-gray-300 p-2 text-right">
                ${totalRevenue.toFixed(2)}
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
    </div>
  );
};

export default TableData;