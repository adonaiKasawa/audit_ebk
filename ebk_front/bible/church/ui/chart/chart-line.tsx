"use client";

// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardBody } from "@heroui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function ComponentChartLine({
  data,
}: {
  data: {
    occurrence: string;
    response: number;
    fill: string;
  }[];
}) {
  return (
    <Card>
      <CardBody>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              axisLine={false}
              dataKey="occurrence"
              tickLine={false}
              tickMargin={10}
              type="category"
              // tickFormatter={(value) =>
              //   chartConfig[value as keyof typeof chartConfig]?.label
              // }
            />
            <XAxis hide dataKey="response" type="number" />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Bar dataKey="response" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
}
