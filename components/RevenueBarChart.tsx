"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Product } from "@/db/schema";

export const description = "Monthly revenue";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface FinanceChartProps {
  data: Product[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function RevenueBarChart({ data }: FinanceChartProps) {
  const revenueByMonth = data.reduce(
    (acc, item) => {
      const monthIndex = item.date.getMonth(); // 0-11
      const monthLabel = monthNames[monthIndex];
      const itemRevenue = Number(item.price) * item.amount;

      acc[monthLabel] = (acc[monthLabel] ?? 0) + itemRevenue;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = monthNames
    .filter((month) => revenueByMonth[month] !== undefined)
    .map((month) => ({
      month,
      revenue: revenueByMonth[month],
    }));

  const totalRevenue = chartData.reduce((sum, entry) => sum + entry.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Month</CardTitle>
        <CardDescription>
          {chartData.length > 0
            ? `${chartData[0].month} - ${chartData[chartData.length - 1].month}`
            : "No data for selected range"}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ bottom: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              label={{ value: "Month", position: "insideBottom", offset: -6 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              label={{
                value: "Revenue ($)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total revenue: ${totalRevenue.toFixed(2)}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing revenue for the selected date range
        </div>
      </CardFooter>
    </Card>
  );
}
