export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContact: string; // ISO date string e.g. "2026-08-01"
  notes?: string;
}
