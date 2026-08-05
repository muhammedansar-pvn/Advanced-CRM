export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContact: string;
  notes?: string;
}
