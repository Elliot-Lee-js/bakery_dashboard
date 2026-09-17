"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
import { Cost } from "@/db/schema"

export const description = "Monthly cost breakdown"

const chartConfig = {
  amount: {
    label: "Amount Spent",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig

interface CostBarChartProps {
  data: Cost[];
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CostBarChart({ data }: CostBarChartProps) {
  // Group total cost by month
  const costByMonth = data.reduce((acc, item) => {
    const monthIndex = item.date.getMonth(); // 0-11
    const monthLabel = monthNames[monthIndex];

    acc[monthLabel] = (acc[monthLabel] ?? 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  // Build chart data in calendar order, only including months present in data
  const chartData = monthNames
    .filter((month) => costByMonth[month] !== undefined)
    .map((month) => ({
      month,
      amount: costByMonth[month],
    }));

  const totalCost = chartData.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Month</CardTitle>
        <CardDescription>
          {chartData.length > 0
            ? `${chartData[0].month} - ${chartData[chartData.length - 1].month}`
            : "No data for selected range"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total spent: ${totalCost.toFixed(2)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total cost for the selected date range
        </div>
      </CardFooter>
    </Card>
  )
}