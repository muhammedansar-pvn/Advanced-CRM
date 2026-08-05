"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  User,
  Shield,
  Bell,
  Sliders,
  Check,
  Key,
  Globe,
  Mail,
  Save,
  Building,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "integrations">("profile");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@apexcrm.com");
  const [role, setRole] = useState("Administrator");

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dealUpdates, setDealUpdates] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal preferences, system notifications, and security configurations.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saved ? "Saved Changes!" : "Save Changes"}</span>
          </button>
        </div>

        <div className="flex border-b space-x-6 overflow-x-auto">
          {[
            { id: "profile", label: "General Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security & Access", icon: Shield },
            { id: "integrations", label: "Integrations", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
                <CardDescription>Update your avatar and user information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl border">
                    JD
                  </div>
                  <div>
                    <button className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors">
                      Change Photo
                    </button>
                    <p className="text-[11px] text-muted-foreground mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Role / Designation</label>
                    <input
                      type="text"
                      value={role}
                      disabled
                      className="h-10 w-full rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Company</label>
                    <input
                      type="text"
                      value="ApexCRM Inc"
                      disabled
                      className="h-10 w-full rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want sent directly to your inbox.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-semibold text-sm">Deal Status Changes</p>
                    <p className="text-xs text-muted-foreground">Get notified when a deal moves stage</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dealUpdates}
                    onChange={(e) => setDealUpdates(e.target.checked)}
                    className="h-4 w-4 rounded border-muted text-primary focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-semibold text-sm">Task Reminders</p>
                    <p className="text-xs text-muted-foreground">Daily digest of upcoming & high priority tasks</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-muted text-primary focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Weekly Performance Report</p>
                    <p className="text-xs text-muted-foreground">Summary email every Monday morning</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyReport}
                    onChange={(e) => setWeeklyReport(e.target.checked)}
                    className="h-4 w-4 rounded border-muted text-primary focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Password & Authentication</CardTitle>
                <CardDescription>Keep your access credentials safe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    />
                  </div>
                  <button className="w-fit rounded-lg border bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                    Update Password
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="space-y-6">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Connected Tools</CardTitle>
                <CardDescription>Integrate external communication and storage services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Google Workspace / Gmail", desc: "Sync contacts and email threads automatically", status: "Connected" },
                  { name: "Slack Notifications", desc: "Push instant alerts to a #sales channel", status: "Disconnected" },
                  { name: "Zapier Webhooks", desc: "Automate custom CRM workflows with 5,000+ apps", status: "Connected" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                        item.status === "Connected"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      )}
                    >
                      {item.status === "Connected" ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
