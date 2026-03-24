"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyMetric } from "@/lib/metricool/types";

interface FollowersChartProps {
  data: DailyMetric[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-xs text-orange-400">
        Followers: {payload[0]?.value?.toLocaleString()}
      </p>
    </div>
  );
}

export function FollowersChart({ data }: FollowersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Follower Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(25 95% 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(25 95% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
                }
                domain={["dataMin - 50", "dataMax + 50"]}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="followers"
                stroke="hsl(25 95% 55%)"
                strokeWidth={2}
                fill="url(#followerGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "hsl(25 95% 55%)",
                  stroke: "hsl(0 0% 10%)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
