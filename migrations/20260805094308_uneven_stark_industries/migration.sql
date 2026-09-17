CREATE TYPE "cost_category" AS ENUM('ingredients', 'operations', 'staff', 'maintenance', 'miscellaneous');--> statement-breakpoint
CREATE TABLE "cost_table" (
	"id" serial PRIMARY KEY,
	"name" varchar(40) NOT NULL,
	"category" "cost_category" NOT NULL,
	"description" text NOT NULL,
	"amount" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_table" (
	"id" serial PRIMARY KEY,
	"name" varchar(40) NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
