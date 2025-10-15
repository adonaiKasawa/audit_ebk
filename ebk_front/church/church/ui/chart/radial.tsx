"use client";

import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { FiTrendingUp } from "react-icons/fi";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

// import { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig;

export function RadsialComponent() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <p>Radial Chart - Text</p>
        <p>January - June 2024</p>
      </CardHeader>
      <CardBody className="flex-1 pb-0">
        <ResponsiveContainer height={300} width={"100%"}>
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="visitors"
              fill="#8884d8"
              nameKey="browser"
              outerRadius={50}
            />
            <Pie
              label
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="visitors"
              fill="#82ca9d"
              innerRadius={60}
              nameKey="browser"
              outerRadius={80}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <FiTrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
