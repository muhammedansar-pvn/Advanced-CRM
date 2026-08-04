export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
}
