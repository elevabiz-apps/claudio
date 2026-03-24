"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyMetric } from "@/lib/metricool/types";

interface EngagementChartProps {
  data: DailyMetric[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-xs text-emerald-400">
        Engagement: {payload[0]?.value}%
      </p>
    </div>
  );
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(0 0% 20%)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={["dataMin - 1", "dataMax + 1"]}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="hsl(160 60% 50%)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "hsl(160 60% 50%)",
                  stroke: "hsl(0 0% 10%)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
