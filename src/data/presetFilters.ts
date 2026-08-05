import { CustomerFilters } from "@/types";

export const initialFilters: CustomerFilters = {
  status: [],
  companies: [],
  email: "",
  phone: "",
  dateRange: { start: "", end: "" },
};

export interface PresetFilter {
  label: string;
  filters: CustomerFilters;
}

export const getPresetFilters = (): PresetFilter[] => {
  const today = new Date().toISOString().split("T")[0];

  const getPastDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  };

  return [
    {
      label: "Active Customers",
      filters: {
        ...initialFilters,
        status: ["active"],
      },
    },
    {
      label: "Inactive Customers",
      filters: {
        ...initialFilters,
        status: ["inactive"],
      },
    },
    {
      label: "Recent Contacts",
      filters: {
        ...initialFilters,
        dateRange: {
          start: getPastDate(14),
          end: today,
        },
      },
    },
    {
      label: "Last 7 Days",
      filters: {
        ...initialFilters,
        dateRange: {
          start: getPastDate(7),
          end: today,
        },
      },
    },
    {
      label: "Last 30 Days",
      filters: {
        ...initialFilters,
        dateRange: {
          start: getPastDate(30),
          end: today,
        },
      },
    },
    {
      label: "High Value Customers",
      filters: {
        ...initialFilters,

        status: ["active"],
      },
    },
  ];
};
