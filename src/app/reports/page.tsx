"use client";

import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Download,
  DollarSign,
  Target,
  Users,
  Award,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

export default function ReportsPage() {
  const conversionFunnel = [
    { stage: "Leads Generated", count: 240, percentage: "100%", color: "bg-blue-500" },
    { stage: "Qualified Leads", count: 168, percentage: "70%", color: "bg-indigo-500" },
    { stage: "Proposals Sent", count: 96, percentage: "40%", color: "bg-violet-500" },
    { stage: "Negotiations", count: 52, percentage: "21.6%", color: "bg-amber-500" },
    { stage: "Deals Closed", count: 38, percentage: "15.8%", color: "bg-emerald-500" },
  ];

  const topPerformers = [
    { name: "John Doe", deals: 14, revenue: "$215,000", winRate: "68%" },
    { name: "Sarah Smith", deals: 11, revenue: "$180,000", winRate: "62%" },
    { name: "Alex Johnson", deals: 9, revenue: "$155,000", winRate: "55%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Performance metrics, sales conversion funnels, and revenue insights.
            </p>
          </div>
          <button className="inline-flex items-center justify-center space-x-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Q3 Revenue Target</CardTitle>
              <Target className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$550,000</div>
              <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-500">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>82% of target achieved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Sales Cycle</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24 Days</div>
              <p className="text-xs text-muted-foreground mt-1">-3 days faster than Q2</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.8%</div>
              <p className="text-xs text-muted-foreground mt-1">+2.4% from overall average</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Lead Source</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Inbound Web</div>
              <p className="text-xs text-muted-foreground mt-1">42% of total pipeline deals</p>
            </CardContent>
          </Card>
        </div>

        {/* Funnel & Monthly Target Grids */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Conversion Funnel */}
          <Card className="border-muted/60">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Sales Conversion Funnel</CardTitle>
              <CardDescription>Stage-by-stage customer acquisition breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversionFunnel.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.stage}</span>
                    <span className="text-muted-foreground">{item.count} ({item.percentage})</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: item.percentage }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Revenue Chart representation */}
          <Card className="border-muted/60">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Monthly Revenue Trend</CardTitle>
              <CardDescription>Completed revenue per month vs projections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { month: "May 2026", amount: "$120,000", pct: 60 },
                { month: "Jun 2026", amount: "$165,000", pct: 78 },
                { month: "Jul 2026", amount: "$190,000", pct: 90 },
                { month: "Aug 2026 (P)", amount: "$210,000", pct: 95 },
              ].map((m, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>{m.month}</span>
                    <span className="text-primary font-bold">{m.amount}</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Reps Leaderboard */}
        <Card className="border-muted/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Top Performing Sales Representatives</span>
              </CardTitle>
              <CardDescription className="mt-1">Ranked by closed won value this quarter</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {topPerformers.map((rep, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{rep.name}</p>
                      <p className="text-xs text-muted-foreground">{rep.deals} deals closed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-foreground">{rep.revenue}</p>
                    <p className="text-xs text-emerald-500 font-medium">{rep.winRate} win rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
