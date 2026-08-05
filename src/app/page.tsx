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
  Activity
} from "lucide-react";

export default function Home() {
  const stats = [
    {
      title: "Total Customers",
      value: "1,284",
      description: "+12.2% from last month",
      trend: "up",
      icon: Users,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Active Customers",
      value: "943",
      description: "+8.4% from last week",
      trend: "up",
      icon: UserCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Inactive Customers",
      value: "341",
      description: "-2.5% since yesterday",
      trend: "down",
      icon: UserX,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Recent Contacts",
      value: "48",
      description: "Interactions this week",
      trend: "up",
      icon: MessageSquare,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    },
  ];

  return (
    <DashboardLayout>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time customer relations overview and pipeline analytics.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-card border rounded-lg px-4 py-2 text-sm text-muted-foreground font-medium shadow-sm">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span>System status: Normal</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden border-muted/60 relative group">

              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="flex items-center space-x-1.5 mt-2">
                  <span className="flex items-center text-xs font-semibold">
                    {stat.trend === "up" ? (
                      <span className="text-emerald-500 flex items-center">
                        <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center">
                        <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-muted/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>CRM Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to the ApexCRM Dashboard. Here you can track your business pipeline, manage customer relations, and review detailed performance metrics.
            </p>
            <div className="p-4 rounded-xl bg-muted/40 border border-muted flex items-start space-x-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Tip of the day</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Keep active engagement records updated to build better predictive analytics forecasts on deal wins.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/60 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "10 mins ago", text: "New lead registered: Acme Corp" },
                { time: "2 hrs ago", text: "Task completed: Follow up with Sarah" },
                { time: "5 hrs ago", text: "Deal updated: Big Tech contract" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium text-xs text-foreground">{activity.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
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
