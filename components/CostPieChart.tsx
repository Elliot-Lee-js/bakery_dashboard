"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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

export const description = "Cost breakdown by category"

const chartConfig = {
  amount: {
    label: "Amount",
  },
  ingredients: {
    label: "Ingredients",
    color: "var(--chart-6)",
  },
  operations: {
    label: "Operations",
    color: "var(--chart-8)",
  },
  staff: {
    label: "Staff",
    color: "var(--chart-9)",
  },
  maintenance: {
    label: "Maintenance",
    color: "var(--chart-7)",
  },
  miscellaneous: {
    label: "Miscellaneous",
    color: "var(--chart-10)",
  },
} satisfies ChartConfig

interface CostPieChartProps {
  data: Cost[];
}

export function CostPieChart({ data }: CostPieChartProps) {
  // Group total cost by category
  const costByCategory = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  // Build chart data, attaching a fill color per category from chartConfig
  const chartData = Object.entries(costByCategory).map(([category, amount]) => ({
    category,
    amount,
    fill: `var(--color-${category})`,
  }));

  const totalCost = chartData.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cost by Category</CardTitle>
        <CardDescription>
          {data.length > 0 ? "Selected date range" : "No data for selected range"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
  <ChartContainer
  config={chartConfig}
  className="mx-auto aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
>
  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
    <Pie
      data={chartData}
      dataKey="amount"
      outerRadius="70%"
      label={(props) => `$${Number(props.value).toFixed(2)}`}
      nameKey="category"
    />
  </PieChart>
</ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total cost: ${totalCost.toFixed(2)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing cost breakdown for the selected date range
        </div>
      </CardFooter>
    </Card>
  )
}