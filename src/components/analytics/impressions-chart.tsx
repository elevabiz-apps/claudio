"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyMetric } from "@/lib/metricool/types";

interface ImpressionsChartProps {
  data: DailyMetric[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-xs text-blue-400">
        Impressions: {payload[0]?.value?.toLocaleString()}
      </p>
      <p className="text-xs text-purple-400">
        Reach: {payload[1]?.value?.toLocaleString()}
      </p>
    </div>
  );
}

export function ImpressionsChart({ data }: ImpressionsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Impressions & Reach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
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
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar
                dataKey="impressions"
                fill="hsl(217 91% 60%)"
                radius={[3, 3, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="reach"
                fill="hsl(270 70% 60%)"
                radius={[3, 3, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
