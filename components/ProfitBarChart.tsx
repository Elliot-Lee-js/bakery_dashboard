"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Cost, Product } from "@/db/schema"

export const description = "Monthly profit with positive/negative bars"

const chartConfig = {
  profit: {
    label: "Profit",
  },
} satisfies ChartConfig

interface ProfitBarChartProps {
  productData: Product[];
  costData: Cost[];
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function ProfitBarChart({ productData, costData }: ProfitBarChartProps) {
  const revenueByMonth = productData.reduce((acc, item) => {
    const month = monthNames[item.date.getMonth()];
    acc[month] = (acc[month] ?? 0) + Number(item.price) * item.amount;
    return acc;
  }, {} as Record<string, number>);

  const costByMonth = costData.reduce((acc, item) => {
    const month = monthNames[item.date.getMonth()];
    acc[month] = (acc[month] ?? 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  const monthsWithData = monthNames.filter(
    (month) => revenueByMonth[month] !== undefined || costByMonth[month] !== undefined
  );

  const chartData = monthsWithData.map((month) => ({
    month,
    profit: (revenueByMonth[month] ?? 0) - (costByMonth[month] ?? 0),
  }));

  const totalProfit = chartData.reduce((sum, entry) => sum + entry.profit, 0);

  const formatCompact = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Monthly Profit</CardTitle>
        <CardDescription>
          {chartData.length > 0
            ? `${chartData[0].month} - ${chartData[chartData.length - 1].month}`
            : "No data for selected range"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 30 }} barCategoryGap="20%">
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
                  hideLabel
                  hideIndicator
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
              }
            />
            <Bar dataKey="profit" radius={4}>
              <LabelList
                position="top"
                dataKey="profit"
                fillOpacity={1}
                fontSize={10}
                formatter={(value: any) => formatCompact(Number(value))}
              />
              {chartData.map((item) => (
                <Cell
                  key={item.month}
                  fill={item.profit >= 0 ? "var(--chart-1)" : "var(--chart-6)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total profit: ${totalProfit.toFixed(2)}{" "}
          {totalProfit >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing profit by month for the selected date range
        </div>
      </CardFooter>
    </Card>
  )
}