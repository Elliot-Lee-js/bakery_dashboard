import {
  pgTable,
  serial,
  timestamp,
  varchar,
  decimal,
  pgEnum,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const storeLocationEnum = pgEnum("store_location", [
  "Thornlie",
  "Victoria Park",
  "Morley",
  "Myaree",
])

export type Location = Product["location"];

export const productTable = pgTable("product_table", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  name: varchar("name", { length: 40 }).notNull(),
  price: decimal("price", {precision: 10,scale: 2}).notNull(),
  amount: integer("amount").notNull(),
  location: storeLocationEnum("location").notNull(),
  description: varchar({length: 200}), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof productTable.$inferSelect;
export type NewProduct = typeof productTable.$inferInsert;

export const costCategoryEnum = pgEnum("cost_category", [
  "ingredients",
  "operations", 
  "staff",
  "maintenance",
  "miscellaneous",
]);

export type CostCategory = Cost['category']; 

export const costTable = pgTable("cost_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 40 }).notNull(),
  category: costCategoryEnum("category").notNull(),
  description: text("description").notNull(), 
  amount: decimal("amount", {precision: 10, scale: 2}).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  location: storeLocationEnum("location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Cost = typeof costTable.$inferSelect;
export type NewCost = typeof costTable.$inferInsert; 