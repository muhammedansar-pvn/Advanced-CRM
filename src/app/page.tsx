"use client";

import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "1,284",
    description: "+12.2% from last month",
    trend: "up" as const,
    icon: Users,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Active Customers",
    value: "943",
    description: "+8.4% from last week",
    trend: "up" as const,
    icon: UserCheck,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Inactive Customers",
    value: "341",
    description: "-2.5% since yesterday",
    trend: "down" as const,
    icon: UserX,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Recent Contacts",
    value: "48",
    description: "Interactions this week",
    trend: "up" as const,
    icon: MessageSquare,
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  },
];

const activities = [
  { time: "10 mins ago", text: "New lead registered: Acme Corp" },
  { time: "2 hrs ago", text: "Task completed: Follow up with Sarah" },
  { time: "5 hrs ago", text: "Deal updated: Big Tech contract" },
];

export default function Home() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-slide-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time customer relations overview and pipeline analytics.
          </p>
        </div>
        <div
          className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2 text-sm text-muted-foreground font-medium shadow-sm self-start sm:self-auto"
          aria-label="System status: Normal"
        >
          <Activity className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          <span>System status:</span>
          <span className="text-emerald-600 font-semibold">Normal</span>
        </div>
      </div>

      {/* Stat cards */}
      <div
        className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-fade-slide-in"
        style={{ animationDelay: "0.05s" }}
        role="region"
        aria-label="Key metrics"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="card-hover overflow-hidden border-muted/60 relative group"
            >
              {/* Accent top bar */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stat.color} transition-transform duration-200 group-hover:scale-110`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold tracking-tight" aria-label={`${stat.title}: ${stat.value}`}>
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-500 shrink-0" aria-hidden="true" />
                  )}
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom section */}
      <div
        className="mt-6 grid gap-5 md:grid-cols-3 animate-fade-slide-in"
        style={{ animationDelay: "0.1s" }}
      >
        {/* CRM Insights */}
        <Card className="md:col-span-2 card-hover border-muted/60">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 border border-primary/12">
                <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              </div>
              CRM Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to the ApexCRM Dashboard. Track your business pipeline, manage customer
              relations, and review detailed performance metrics.
            </p>
            <div className="p-4 rounded-xl bg-muted/40 border border-muted/60 flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                <Activity className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Tip of the day</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Keep active engagement records updated to build better predictive analytics
                  forecasts on deal wins.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="card-hover border-muted/60 bg-muted/5">
          <CardHeader>
            <CardTitle className="text-base font-bold">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" role="feed" aria-label="Recent activity">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-sm group/item">
                  <div
                    className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 transition-transform duration-200 group-hover/item:scale-125"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-xs text-foreground leading-snug">
                      {activity.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      <time>{activity.time}</time>
                    </p>
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
