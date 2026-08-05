"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Deal, DealStage } from "@/types/deals";
import { Button } from "@/components/ui/button";

interface DealFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: Omit<Deal, "id" | "createdAt">) => void;
}

const STAGES: { id: DealStage; label: string }[] = [
  { id: "lead", label: "Lead In" },
  { id: "contacted", label: "Contacted" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed_won", label: "Closed Won" },
  { id: "closed_lost", label: "Closed Lost" },
];

export function DealFormDialog({ isOpen, onClose, onSubmit }: DealFormDialogProps) {
  const [title, setTitle] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [value, setValue] = React.useState("");
  const [stage, setStage] = React.useState<DealStage>("lead");
  const [probability, setProbability] = React.useState("50");
  const [expectedCloseDate, setExpectedCloseDate] = React.useState("");
  const [owner, setOwner] = React.useState("John Doe");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim() || !value) return;

    onSubmit({
      title: title.trim(),
      customerName: customerName.trim(),
      value: parseFloat(value) || 0,
      stage,
      probability: parseInt(probability, 10) || 50,
      expectedCloseDate: expectedCloseDate || new Date().toISOString().split("T")[0],
      owner: owner.trim() || "John Doe",
    });

    setTitle("");
    setCustomerName("");
    setValue("");
    setStage("lead");
    setProbability("50");
    setExpectedCloseDate("");
    setOwner("John Doe");

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[92%] sm:max-w-[500px] rounded-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add New Deal</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create a new sales deal opportunity in your pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold mb-1 text-foreground">
              Deal Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise License Expansion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-foreground">
              Customer / Account Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Corp"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Deal Value ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="25000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Stage *
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Win Probability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground">
                Expected Close Date
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-foreground">
              Deal Owner
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
