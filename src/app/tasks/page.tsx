"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TASKS } from "@/data/mock-tasks";
import { Task, TaskPriority, TaskStatus } from "@/types/tasks";
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListTodo
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | TaskStatus>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || task.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: TaskStatus =
          t.status === "completed" ? "todo" : t.status === "todo" ? "in_progress" : "completed";
        return { ...t, status: nextStatus };
      })
    );
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return { label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
      case "in_progress":
        return { label: "In Progress", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      case "todo":
        return { label: "To Do", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
    }
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
            <p className="text-muted-foreground mt-1">
              Organize sales follow-ups, client meetings, and team action items.
            </p>
          </div>
          <button className="inline-flex items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Task Metric Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">To Do Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting start</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active tasks</p>
            </CardContent>
          </Card>

          <Card className="border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Done this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center space-x-1 border rounded-lg p-1 bg-muted/30">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("todo")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === "todo" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              To Do ({todoCount})
            </button>
            <button
              onClick={() => setActiveTab("in_progress")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === "in_progress" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === "completed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Task List Container */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed text-center">
              <CheckSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-semibold text-sm">No tasks found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or active filter.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const statusInfo = getStatusBadge(task.status);

              return (
                <Card
                  key={task.id}
                  className={cn(
                    "border-muted/60 transition-all hover:border-muted",
                    task.status === "completed" && "bg-muted/20 opacity-80"
                  )}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-0.5 flex-shrink-0 focus:outline-none"
                      >
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors" />
                        )}
                      </button>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span
                            className={cn(
                              "font-semibold text-sm",
                              task.status === "completed" && "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </span>
                          <span className={cn("px-2 py-0.5 text-[10px] font-semibold rounded-md border uppercase tracking-wider", getPriorityBadge(task.priority))}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>

                      <span className={cn("px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap", statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
