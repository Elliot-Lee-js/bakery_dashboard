"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Cost, Product } from "@/db/schema";

export const description = "Revenue vs cost trend";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  cost: {
    label: "Cost",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

interface TrendLineChartProps {
  productData: Product[];
  costData: Cost[];
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

const formatCompact = (value: number) => {
  if (isNaN(value)) return "";
  const abs = Math.abs(value);
  if (abs >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
};

export function TrendLineChart({ productData, costData }: TrendLineChartProps) {
  const revenueByMonth = productData.reduce(
    (acc, item) => {
      const month = monthNames[item.date.getMonth()];
      acc[month] = (acc[month] ?? 0) + Number(item.price) * item.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const costByMonth = costData.reduce(
    (acc, item) => {
      const month = monthNames[item.date.getMonth()];
      acc[month] = (acc[month] ?? 0) + Number(item.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  const monthsWithData = monthNames.filter(
    (month) =>
      revenueByMonth[month] !== undefined || costByMonth[month] !== undefined,
  );

  const chartData = monthsWithData.map((month) => ({
    month,
    revenue: revenueByMonth[month] ?? 0,
    cost: costByMonth[month] ?? 0,
  }));

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Revenue vs Cost</CardTitle>
        <CardDescription>
          {chartData.length > 0
            ? `${chartData[0].month} - ${chartData[chartData.length - 1].month}`
            : "No data for selected range"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <span>
                      {name === "revenue" ? "Revenue" : "Cost"}: $
                      {Number(value).toFixed(2)}
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={10}
                formatter={(value: any) => formatCompact(Number(value))}
              />
            </Line>
            <Line
              dataKey="cost"
              type="natural"
              stroke="var(--color-cost)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-cost)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="bottom"
                offset={12}
                className="fill-foreground"
                fontSize={10}
                formatter={(value: any) => formatCompact(Number(value))}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Revenue vs cost by month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing revenue and cost for the selected date range
        </div>
      </CardFooter>
    </Card>
  );
}
