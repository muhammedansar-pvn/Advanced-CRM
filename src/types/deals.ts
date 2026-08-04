export type DealStage = "lead" | "contacted" | "proposal" | "negotiation" | "closed_won" | "closed_lost";

export interface Deal {
  id: string;
  title: string;
  customerName: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  createdAt: string;
}
