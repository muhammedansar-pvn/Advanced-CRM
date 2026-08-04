"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DEALS } from "@/data/mock-deals";
import { Deal, DealStage } from "@/types/deals";
import {
  DollarSign,
  Plus,
  Search,
  Building2,
  Calendar,
  User,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: "lead", label: "Lead In", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "contacted", label: "Contacted", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: "proposal", label: "Proposal", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "negotiation", label: "Negotiation", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { id: "closed_won", label: "Closed Won", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: "closed_lost", label: "Closed Lost", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalPipeline = deals.reduce((acc, deal) => acc + (deal.stage !== "closed_lost" ? deal.value : 0), 0);
  const wonValue = deals.reduce((acc, deal) => acc + (deal.stage === "closed_won" ? deal.value : 0), 0);
  const activeDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost").length;
  const winRate = Math.round(
    (deals.filter((d) => d.stage === "closed_won").length /
      (deals.filter((d) => d.stage === "closed_won" || d.stage === "closed_lost").length || 1)) *
      100
  );

  const moveStage = (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage sales opportunities through each pipeline stage.
            </p>
          </div>
          <button className="inline-flex items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Deal</span>
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pipeline Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPipeline.toLocaleString("en-US")}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all active & won deals</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Closed Won Value
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${wonValue.toLocaleString("en-US")}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Realized revenue to date</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Opportunities
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDeals}</div>
              <p className="text-xs text-muted-foreground mt-1">Deals currently in progress</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
              <Briefcase className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Closed won vs closed lost ratio</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deals or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="h-10 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Stages</option>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage.id} className="flex flex-col rounded-xl border bg-card p-4 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-2">
                    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-md border", stage.color)}>
                      {stage.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">({stageDeals.length})</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    ${stageTotal.toLocaleString("en-US")}
                  </span>
                </div>

                <div className="space-y-3 min-h-[150px]">
                  {stageDeals.length === 0 ? (
                    <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                      No deals in this stage
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <Card key={deal.id} className="hover:shadow-md transition-shadow border-muted">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm line-clamp-1">{deal.title}</h3>
                            <span className="text-sm font-bold text-primary">
                              ${deal.value.toLocaleString("en-US")}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1.5">
                              <Building2 className="h-3.5 w-3.5" />
                              <span>{deal.customerName}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{deal.expectedCloseDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3.5 w-3.5" />
                                <span>{deal.owner}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t pt-2 mt-2 text-[11px]">
                            <span className="text-muted-foreground">Probability: {deal.probability}%</span>
                            <select
                              value={deal.stage}
                              onChange={(e) => moveStage(deal.id, e.target.value as DealStage)}
                              className="rounded border bg-muted/40 px-1.5 py-0.5 text-[11px] focus:outline-none"
                            >
                              {STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move to {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
