import { CustomerStatus } from "./customer";

export interface DateRange {
  start: string;
  end: string;
}

export interface CustomerFilters {
  status: CustomerStatus[];
  companies: string[];
  email: string;
  phone: string;
  dateRange: DateRange;
}

export interface SavedFilterConfig {
  id: string;
  name: string;
  filters: CustomerFilters;
  createdAt: string;
}
