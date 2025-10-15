"use client";

import { Card, CardBody } from "@heroui/card";
import * as React from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

// import { ChartConfig } from "@/components/ui/chart";

// const chartData = [
//   { occurrence: "chrome", response: 275, fill: "#e8567a" },
//   { occurrence: "safari", response: 200, fill: "#6171ff" },
//   { occurrence: "firefox", response: 287, fill: "#ed7c02" },
//   { occurrence: "edge", response: 173, fill: "#39cc04" },
//   { occurrence: "other", response: 190, fill: "#e332dd" },
// ];

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// } satisfies ChartConfig;

export function ChartDonutComponent({
  data,
}: {
  data: {
    occurrence: string;
    response: number;
    fill: string;
  }[];
}) {
  return (
    <Card className="flex flex-col">
      <CardBody className="flex-1 pb-0">
        <ResponsiveContainer height={300} width={"100%"}>
          <PieChart>
            <Pie
              label
              data={data}
              dataKey="response"
              innerRadius={80}
              labelLine={true}
              nameKey="occurrence"
              strokeWidth={0}
            >
              {/* <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl text-warning"
                          style={{color: 'red'}}
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-default-500"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              /> */}
              <div className="w-full h-full bg-danger-500">
                <p>25645</p>
              </div>
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
