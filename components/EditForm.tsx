"use client";

import * as React from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DatePicker } from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProductData,
  getCostData,
  updateProductData,
  updateCostData,
  deleteProductData,
  deleteCostData,
} from "@/actions/form";
import { Product, Cost, Location } from "@/db/schema";
import { toast } from "sonner";

const productHeaders = [
  { id: "1", label: "Date" },
  { id: "2", label: "Product" },
  { id: "3", label: "Description" },
  { id: "4", label: "Price" },
  { id: "5", label: "Amount" },
  { id: "6", label: "Profit" },
  { id: "7", label: "" },
];

const costHeaders = [
  { id: "1", label: "Date" },
  { id: "2", label: "Item" },
  { id: "3", label: "Category" },
  { id: "4", label: "Description" },
  { id: "5", label: "Amount" },
  { id: "6", label: "" },
];

const categories = [
  { label: "Ingredients", value: "ingredients" },
  { label: "Operations", value: "operations" },
  { label: "Staff", value: "staff" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Miscellaneous", value: "miscellaneous" },
];

const ROWS_PER_PAGE = 10;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <Button
            key={page}
            variant="outline"
            size="sm"
            className={`w-8 ${page === currentPage ? "bg-blue-300 hover:bg-blue-300" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

interface EditFormProps {
  location: Location;
  showBorder?: boolean;
  tableType?: string;
}

const EditForm = ({ location, showBorder = true }: EditFormProps) => {
  const [tableType, setTableType] = React.useState<"Revenue" | "Cost">("Revenue");

  const [products, setProducts] = React.useState<Product[]>([]);
  const [costs, setCosts] = React.useState<Cost[]>([]);

  const [productPage, setProductPage] = React.useState(1);
  const [costPage, setCostPage] = React.useState(1);

  const [editingProductId, setEditingProductId] = React.useState<number | null>(null);
  const [productDraft, setProductDraft] = React.useState<Product | null>(null);

  const [editingCostId, setEditingCostId] = React.useState<number | null>(null);
  const [costDraft, setCostDraft] = React.useState<Cost | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductData(undefined, undefined, location);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [location]);

  React.useEffect(() => {
    const fetchCosts = async () => {
      try {
        const data = await getCostData(undefined, undefined, undefined, location);
        setCosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCosts();
  }, [location]);

  // --- Pagination slices ---
  const totalProductPages = Math.max(1, Math.ceil(products.length / ROWS_PER_PAGE));
  const paginatedProducts = products.slice(
    (productPage - 1) * ROWS_PER_PAGE,
    productPage * ROWS_PER_PAGE,
  );

  const totalCostPages = Math.max(1, Math.ceil(costs.length / ROWS_PER_PAGE));
  const paginatedCosts = costs.slice(
    (costPage - 1) * ROWS_PER_PAGE,
    costPage * ROWS_PER_PAGE,
  );

  // --- Totals (based on full dataset, not just the current page) ---
  const totalRevenue = products.reduce(
    (sum, item) => sum + Number(item.price) * item.amount,
    0,
  );
  const totalCostAmount = costs.reduce((sum, item) => sum + Number(item.amount), 0);

  // --- Product edit handlers ---
  const startEditProduct = (item: Product) => {
    setEditingProductId(item.id);
    setProductDraft({ ...item });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductDraft(null);
  };

  const saveEditProduct = async () => {
    if (!productDraft) return;
    try {
      await updateProductData({
        id: productDraft.id,
        date: productDraft.date,
        name: productDraft.name,
        price: productDraft.price,
        amount: productDraft.amount,
        location: productDraft.location,
        description: productDraft.description,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productDraft.id ? productDraft : p)),
      );
      toast("Product updated successfully", { position: "bottom-right" });
      setEditingProductId(null);
      setProductDraft(null);
    } catch (error) {
      console.error(error);
      toast("Failed to update product", { position: "bottom-right" });
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await deleteProductData(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingProductId === id) cancelEditProduct();
      toast("Product deleted", { position: "bottom-right" });
    } catch (error) {
      console.error(error);
      toast("Failed to delete product", { position: "bottom-right" });
    }
  };

  const updateProductDraft = <K extends keyof Product>(field: K, value: Product[K]) => {
    setProductDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };


  const startEditCost = (item: Cost) => {
    setEditingCostId(item.id);
    setCostDraft({ ...item });
  };

  const cancelEditCost = () => {
    setEditingCostId(null);
    setCostDraft(null);
  };

  const saveEditCost = async () => {
    if (!costDraft) return;
    try {
      await updateCostData({
        id: costDraft.id,
        name: costDraft.name,
        category: costDraft.category,
        description: costDraft.description,
        amount: costDraft.amount,
        date: costDraft.date,
        location: costDraft.location,
      });
      setCosts((prev) => prev.map((c) => (c.id === costDraft.id ? costDraft : c)));
      toast("Cost updated successfully", { position: "bottom-right" });
      setEditingCostId(null);
      setCostDraft(null);
    } catch (error) {
      console.error(error);
      toast("Failed to update cost", { position: "bottom-right" });
    }
  };

  const deleteCost = async (id: number) => {
    try {
      await deleteCostData(id);
      setCosts((prev) => prev.filter((c) => c.id !== id));
      if (editingCostId === id) cancelEditCost();
      toast("Cost deleted", { position: "bottom-right" });
    } catch (error) {
      console.error(error);
      toast("Failed to delete cost", { position: "bottom-right" });
    }
  };

  const updateCostDraft = <K extends keyof Cost>(field: K, value: Cost[K]) => {
    setCostDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className={`bg-white border ${showBorder ? "border-gray-300" : "border-0"} rounded-md p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold tracking-wide">
          {tableType === "Revenue" ? "Revenue By Products" : "Costs"}
        </h1>
        <ButtonGroup>
          <Button
            className={`text-[13px] ${tableType === "Revenue" ? "bg-blue-300 hover:bg-blue-300" : ""}`}
            variant="outline"
            onClick={() => setTableType("Revenue")}
          >
            Revenue
          </Button>
          <Button
            className={`text-[13px] ${tableType === "Cost" ? "bg-blue-300 hover:bg-blue-300" : ""}`}
            variant="outline"
            onClick={() => setTableType("Cost")}
          >
            Cost
          </Button>
        </ButtonGroup>
      </div>

      <div className="w-full overflow-x-auto">
        {tableType === "Revenue" ? (
          <>
            <table className="w-full overflow-hidden">
              <thead>
                <tr>
                  {productHeaders.map((header) => (
                    <th className="border border-gray-300 p-2 text-left" key={header.id}>
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((item) => {
                  const isEditing = editingProductId === item.id;

                  if (isEditing && productDraft) {
                    return (
                      <tr key={item.id} className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-1">
                          <DatePicker
                            date={productDraft.date}
                            onSelect={(d) => d && updateProductDraft("date", d)}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            value={productDraft.name}
                            onChange={(e) => updateProductDraft("name", e.target.value)}
                            className="h-8"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            value={productDraft.description ?? ""}
                            onChange={(e) => updateProductDraft("description", e.target.value)}
                            className="h-8"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="number"
                            step="0.01"
                            value={productDraft.price}
                            onChange={(e) => updateProductDraft("price", e.target.value)}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="number"
                            value={productDraft.amount}
                            onChange={(e) =>
                              updateProductDraft("amount", parseInt(e.target.value) || 0)
                            }
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                          ${(Number(productDraft.price) * productDraft.amount).toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <div className="flex gap-1 justify-center">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveEditProduct}>
                              <Check className="size-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditProduct}>
                              <X className="size-4 text-gray-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  const totalItemRevenue = Number(item.price) * item.amount;

                  return (
                    <tr key={item.id} className="hover:bg-blue-100 transition-colors">
                      <td className="border border-gray-300 px-2 py-1">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 font-medium">{item.name}</td>
                      <td className="border border-gray-300 px-2 py-1 text-gray-600">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">{item.amount}</td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-medium text-green-600">
                        ${totalItemRevenue.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <div className="flex gap-1 justify-center">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditProduct(item)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteProduct(item.id)}>
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 p-2" colSpan={5}>
                    Total (all pages)
                  </td>
                  <td className="border border-gray-300 p-2 text-right text-green-600">
                    ${totalRevenue.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">
                Page {productPage} of {totalProductPages}
              </span>
              <Pagination
                currentPage={productPage}
                totalPages={totalProductPages}
                onPageChange={setProductPage}
              />
            </div>
          </>
        ) : (
          <>
            <table className="w-full overflow-hidden">
              <thead>
                <tr>
                  {costHeaders.map((header) => (
                    <th className="border border-gray-300 p-2 text-left" key={header.id}>
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedCosts.map((item) => {
                  const isEditing = editingCostId === item.id;

                  if (isEditing && costDraft) {
                    return (
                      <tr key={item.id} className="bg-blue-50">
                        <td className="border border-gray-300 px-2 py-1">
                          <DatePicker
                            date={costDraft.date}
                            onSelect={(d) => d && updateCostDraft("date", d)}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            value={costDraft.name}
                            onChange={(e) => updateCostDraft("name", e.target.value)}
                            className="h-8"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Select
                            value={costDraft.category}
                            onValueChange={(value) => updateCostDraft("category", value as Cost["category"])}
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {categories.map((c) => (
                                  <SelectItem key={c.value} value={c.value}>
                                    {c.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            value={costDraft.description}
                            onChange={(e) => updateCostDraft("description", e.target.value)}
                            className="h-8"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="number"
                            step="0.01"
                            value={costDraft.amount}
                            onChange={(e) => updateCostDraft("amount", e.target.value)}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <div className="flex gap-1 justify-center">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveEditCost}>
                              <Check className="size-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditCost}>
                              <X className="size-4 text-gray-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-blue-100 transition-colors">
                      <td className="border border-gray-300 px-2 py-1">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 font-medium">{item.name}</td>
                      <td className="border border-gray-300 px-2 py-1 capitalize">{item.category}</td>
                      <td className="border border-gray-300 px-2 py-1 text-gray-600">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        ${Number(item.amount).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <div className="flex gap-1 justify-center">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditCost(item)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteCost(item.id)}>
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 p-2" colSpan={4}>
                    Total (all pages)
                  </td>
                  <td className="border border-gray-300 p-2 text-right text-red-600">
                    ${totalCostAmount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">
                Page {costPage} of {totalCostPages}
              </span>
              <Pagination
                currentPage={costPage}
                totalPages={totalCostPages}
                onPageChange={setCostPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditForm;