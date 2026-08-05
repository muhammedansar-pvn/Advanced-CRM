"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  User,
  Shield,
  Bell,
  Check,
  Globe,
  Save,
  Moon,
  Sun,
  Laptop,
  Upload,
  Trash2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SETTINGS_STORAGE_KEY = "apex_crm_settings_v1";

interface UserSettings {
  name: string;
  email: string;
  role: string;
  company: string;
  avatar: string;
  dealUpdates: boolean;
  emailAlerts: boolean;
  weeklyReport: boolean;
  integrations: {
    google: boolean;
    slack: boolean;
    zapier: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  name: "John Doe",
  email: "john.doe@apexcrm.com",
  role: "Administrator",
  company: "ApexCRM Inc",
  avatar: "",
  dealUpdates: true,
  emailAlerts: true,
  weeklyReport: false,
  integrations: {
    google: true,
    slack: false,
    zapier: true,
  },
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<
    "profile" | "appearance" | "notifications" | "security" | "integrations"
  >("profile");
  const [saved, setSaved] = useState(false);

  // Settings state
  const [name, setName] = useState(DEFAULT_SETTINGS.name);
  const [email, setEmail] = useState(DEFAULT_SETTINGS.email);
  const [role] = useState(DEFAULT_SETTINGS.role);
  const [company] = useState(DEFAULT_SETTINGS.company);
  const [avatar, setAvatar] = useState(DEFAULT_SETTINGS.avatar);

  const [emailAlerts, setEmailAlerts] = useState(DEFAULT_SETTINGS.emailAlerts);
  const [dealUpdates, setDealUpdates] = useState(DEFAULT_SETTINGS.dealUpdates);
  const [weeklyReport, setWeeklyReport] = useState(DEFAULT_SETTINGS.weeklyReport);

  const [integrations, setIntegrations] = useState(DEFAULT_SETTINGS.integrations);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed: Partial<UserSettings> = JSON.parse(stored);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.avatar !== undefined) setAvatar(parsed.avatar);
        if (parsed.emailAlerts !== undefined) setEmailAlerts(parsed.emailAlerts);
        if (parsed.dealUpdates !== undefined) setDealUpdates(parsed.dealUpdates);
        if (parsed.weeklyReport !== undefined) setWeeklyReport(parsed.weeklyReport);
        if (parsed.integrations) setIntegrations(parsed.integrations);
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  // Save all settings to localStorage
  const handleSave = () => {
    const payload: UserSettings = {
      name,
      email,
      role,
      company,
      avatar,
      emailAlerts,
      dealUpdates,
      weeklyReport,
      integrations,
    };

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
      setSaved(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save settings to storage.");
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatar(result);
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Profile photo removed.");
  };

  // Password update handler
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    }, 600);
  };

  // Integration toggle
  const toggleIntegration = (key: keyof typeof integrations, title: string) => {
    setIntegrations((prev) => {
      const nextState = !prev[key];
      const updated = { ...prev, [key]: nextState };
      toast.success(`${title} ${nextState ? "connected" : "disconnected"} successfully!`);
      return updated;
    });
  };

  const userInitials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your personal preferences, system notifications, and security configurations.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all duration-150 active:scale-95"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saved ? "Saved Changes!" : "Save Changes"}</span>
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b space-x-6 overflow-x-auto">
          {[
            { id: "profile", label: "General Profile", icon: User },
            { id: "appearance", label: "Appearance", icon: Sun },
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
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: GENERAL PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-slide-in">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
                <CardDescription>Update your avatar and user information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar section */}
                <div className="flex items-center space-x-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="h-16 w-16 rounded-full object-cover border shadow-sm ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl border">
                      {userInitials || "JD"}
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Change Photo</span>
                      </button>

                      {avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="inline-flex items-center gap-1 rounded-lg border border-destructive/20 text-destructive px-2.5 py-1.5 text-xs font-medium hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                {/* Form fields */}
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
                      value={company}
                      disabled
                      className="h-10 w-full rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: APPEARANCE */}
        {activeTab === "appearance" && (
          <div className="space-y-6 animate-fade-slide-in">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Theme & Interface</CardTitle>
                <CardDescription>Select your preferred visual theme for the CRM dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light Mode", icon: Sun, desc: "Clean bright interface" },
                    { id: "dark", label: "Dark Mode", icon: Moon, desc: "Sleek high-contrast theme" },
                    { id: "system", label: "System Default", icon: Laptop, desc: "Sync with OS theme" },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = theme === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setTheme(mode.id);
                          toast.success(`Theme set to ${mode.label}`);
                        }}
                        className={cn(
                          "flex flex-col items-start p-4 rounded-xl border transition-all text-left space-y-3 relative",
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20"
                            : "border-muted/60 hover:bg-accent/50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{mode.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{mode.desc}</p>
                        </div>
                        {isSelected && (
                          <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fade-slide-in">
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
                    className="h-4 w-4 rounded border-muted text-primary focus:ring-primary accent-primary cursor-pointer"
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
                    className="h-4 w-4 rounded border-muted text-primary focus:ring-primary accent-primary cursor-pointer"
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
                    className="h-4 w-4 rounded border-muted text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fade-slide-in">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Password & Authentication</CardTitle>
                <CardDescription>Keep your access credentials safe.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pl-9"
                      />
                      <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pl-9"
                      />
                      <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pl-9"
                      />
                      <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <span>{isUpdatingPassword ? "Updating..." : "Update Password"}</span>
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: INTEGRATIONS */}
        {activeTab === "integrations" && (
          <div className="space-y-6 animate-fade-slide-in">
            <Card className="border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Connected Tools</CardTitle>
                <CardDescription>Integrate external communication and storage services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "google" as const,
                    name: "Google Workspace / Gmail",
                    desc: "Sync contacts and email threads automatically",
                  },
                  {
                    key: "slack" as const,
                    name: "Slack Notifications",
                    desc: "Push instant alerts to a #sales channel",
                  },
                  {
                    key: "zapier" as const,
                    name: "Zapier Webhooks",
                    desc: "Automate custom CRM workflows with 5,000+ apps",
                  },
                ].map((item) => {
                  const isConnected = integrations[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleIntegration(item.key, item.name)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 active:scale-95",
                          isConnected
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        {isConnected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
