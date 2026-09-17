"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

export const description = "Monthly profit"

const chartConfig = {
  profit: {
    label: "Profit",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

interface MonthlyBarChartProps {
  productData: Product[];
  costData: Cost[];
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthlyBarChart({ productData, costData }: MonthlyBarChartProps) {
  // Revenue per month
  const revenueByMonth = productData.reduce((acc, item) => {
    const month = monthNames[item.date.getMonth()];
    acc[month] = (acc[month] ?? 0) + Number(item.price) * item.amount;
    return acc;
  }, {} as Record<string, number>);

  // Cost per month
  const costByMonth = costData.reduce((acc, item) => {
    const month = monthNames[item.date.getMonth()];
    acc[month] = (acc[month] ?? 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  // Profit = revenue - cost, for any month that has either revenue or cost data
  const monthsWithData = monthNames.filter(
    (month) => revenueByMonth[month] !== undefined || costByMonth[month] !== undefined
  );

  const chartData = monthsWithData.map((month) => ({
    month,
    profit: (revenueByMonth[month] ?? 0) - (costByMonth[month] ?? 0),
  }));

  const totalProfit = chartData.reduce((sum, entry) => sum + entry.profit, 0);

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
      <CardContent className="flex-1 pt-12">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 60,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="profit" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
              }
            />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="profit"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `$${Number(value).toFixed(2)}`}
              />
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
          Showing profit for the selected date range
        </div>
      </CardFooter>
    </Card>
  )
}