import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  iconColor: string;
}

export function StatCard({ title, value, delta, icon: Icon, iconColor }: StatCardProps) {
  const isPositive = delta > 0;
  const isNeutral = delta === 0;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <div className="mt-1 flex items-center gap-1 text-xs">
            {isNeutral ? (
              <Minus className="h-3 w-3 text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span
              className={
                isNeutral
                  ? "text-muted-foreground"
                  : isPositive
                    ? "text-green-400"
                    : "text-red-400"
              }
            >
              {isPositive ? "+" : ""}
              {delta}%
            </span>
            <span className="text-muted-foreground">vs previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
