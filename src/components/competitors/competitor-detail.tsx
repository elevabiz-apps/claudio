"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Activity,
  Users,
  Zap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Competitor, SocialAccount } from "@/lib/competitor-data";
import { PLATFORM_META } from "@/lib/competitor-data";

interface CompetitorDetailProps {
  competitor: Competitor;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

const PLATFORM_CHART_COLORS: Record<string, string> = {
  instagram: "hsl(330 80% 60%)",
  youtube: "hsl(0 70% 55%)",
  tiktok: "hsl(180 70% 55%)",
  twitter: "hsl(200 80% 60%)",
  linkedin: "hsl(217 80% 55%)",
  facebook: "hsl(240 60% 60%)",
};

function FollowerTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
      <p className="text-xs font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">
        {formatNumber(payload[0]?.value)} followers
      </p>
    </div>
  );
}

export function CompetitorDetail({ competitor, onClose, onDelete }: CompetitorDetailProps) {
  const chartData = competitor.accounts.map((a) => ({
    platform: PLATFORM_META[a.platform].label,
    followers: a.followers,
    color: PLATFORM_CHART_COLORS[a.platform],
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{competitor.name}</CardTitle>
            {competitor.notes && (
              <p className="text-xs text-muted-foreground mt-1">{competitor.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={() => onDelete(competitor.id)}
            >
              Remove
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform accounts */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Tracked Accounts
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {competitor.accounts.map((account) => {
              const meta = PLATFORM_META[account.platform];
              return (
                <div
                  key={account.platform}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${meta.borderColor} ${meta.bgColor}`}
                >
                  <div>
                    <p className={`text-xs font-medium ${meta.color}`}>{meta.label}</p>
                    <p className="text-sm font-medium">{account.handle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatNumber(account.followers)}</p>
                    <span className={`inline-flex items-center gap-0.5 text-[11px] ${account.followersGrowth > 0 ? "text-green-400" : "text-red-400"}`}>
                      {account.followersGrowth > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {account.followersGrowth > 0 ? "+" : ""}{account.followersGrowth}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Followers by platform chart */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Followers by Platform
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(0 0% 20%)" />
                <XAxis
                  dataKey="platform"
                  tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip content={<FollowerTooltip />} cursor={false} />
                <Bar dataKey="followers" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key metrics summary */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Performance Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {competitor.accounts.map((a) => {
              const meta = PLATFORM_META[a.platform];
              return (
                <div key={a.platform} className="rounded-lg border border-border p-2.5">
                  <p className={`text-[10px] font-medium ${meta.color} mb-1`}>{meta.label}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Activity className="h-2.5 w-2.5" />Eng.
                      </span>
                      <span className="text-xs font-medium">{a.engagementRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Zap className="h-2.5 w-2.5" />Posts/wk
                      </span>
                      <span className="text-xs font-medium">{a.postsPerWeek}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent posts */}
        {competitor.recentPosts.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Recent Posts
            </h4>
            <div className="space-y-2">
              {competitor.recentPosts.map((post) => {
                const meta = PLATFORM_META[post.platform];
                return (
                  <div
                    key={post.id}
                    className="rounded-lg border border-border p-3 transition-colors hover:bg-accent/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${meta.bgColor} ${meta.color} ${meta.borderColor}`}
                          >
                            {meta.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">{post.date}</span>
                        </div>
                        <p className="text-sm leading-snug line-clamp-2">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatNumber(post.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {formatNumber(post.comments)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {formatNumber(post.shares)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatNumber(post.impressions)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
