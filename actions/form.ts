"use server";

import { db } from "@/db/drizzle";
import { costTable, productTable, CostCategory, Cost, Product, Location, NewCost, NewProduct } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";


export type DateFilter = "today" | "week" | "monthly" | "yearly" | "custom";
export type CategoryFilter = CostCategory

export interface Filter {
  dateFilter: DateFilter;
  startDate?: Date;
  endDate?: Date;
  category?: CategoryFilter;
}

// ------- Cost Table -------

export const getCostData = async (
  startDate?: Date,
  endDate?: Date,
  category?: CostCategory,
  location?: Location
) => {
  try {
    const conditions = [];

    if (startDate) conditions.push(gte(costTable.date, startDate));
    if (endDate) conditions.push(lte(costTable.date, endDate));
    if (category) conditions.push(eq(costTable.category, category));
    if (location) conditions.push(eq(costTable.location, location));

    const costData = await db
      .select()
      .from(costTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return costData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCostData = async (costItem: NewCost) => {
  try {
    await db.insert(costTable).values(costItem);
  } catch (error) {
    console.error(error);
    return {error: "Failed to create item"}
  }
}

export const updateCostData = async (costItem: Omit<Cost, "createdAt" | "updatedAt" >) => {
  try {
    await db.update(costTable).set(costItem).where(eq(costTable.id, costItem.id)).returning();
  } catch (error) {
    console.error(error);
    return {error: "Failed to update item"}
  }
}

export const deleteCostData = async (id: number) => {
  try {
    await db.delete(costTable).where(eq(costTable.id, id))
  } catch (error) {
    console.error(error)
    return {error: "Failed to delete item"}
  }
}

//------- Product Table -------

export const getProductData = async (
  startDate?: Date,
  endDate?: Date,
  location?: Location
) => {
  try {
    const conditions = [];

    if (startDate) conditions.push(gte(productTable.date, startDate));
    if (endDate) conditions.push(lte(productTable.date, endDate));
    if (location) conditions.push(eq(productTable.location, location));

    const productData = await db
      .select()
      .from(productTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return productData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProductData = async (productItem: NewProduct) => {
  try {
    await db.insert(productTable).values(productItem);
  } catch (error) {
    console.error(error);
    return {error: "Failed to create product item"}
  }
}

export const updateProductData = async (productItem: Omit<Product, "createdAt" | "updatedAt">) => {
  try {
    await db.update(productTable).set(productItem).where(eq(productTable.id, productItem.id))
  } catch (error) {
    console.error(error);
    return {error: "Failed to update item"}
  }
}

export const deleteProductData = async (id: number) => {
  try {
    await db.delete(productTable).where(eq(productTable.id, id))
  } catch (error) {
    console.error(error);
    return {error: "Failed to delete item"}
  }
}