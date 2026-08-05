import { Customer } from "@/types";
import { mockCustomers } from "@/data";

const STORAGE_KEY = "apex_crm_customers_db_v1";

const MIN_DELAY = 300;
const MAX_DELAY = 500;

const delay = () => {
  const ms = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const cloneCustomers = (customers: Customer[]) => customers.map((customer) => ({ ...customer }));

function getDb(): Customer[] {
  if (typeof window === "undefined") return cloneCustomers(mockCustomers);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Customer[];
    } catch {
      return cloneCustomers(mockCustomers);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCustomers));
  return cloneCustomers(mockCustomers);
}

function saveDb(data: Customer[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await delay();
    return cloneCustomers(getDb());
  },

  async getCustomer(id: string): Promise<Customer> {
    await delay();
    const db = getDb();
    const customer = db.find((c) => c.id === id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found.`);
    }
    return customer;
  },

  async createCustomer(values: Omit<Customer, "id" | "lastContact">): Promise<Customer> {
    await delay();
    const db = getDb();

    const newCustomer: Customer = {
      ...values,
      id: `cust_${Date.now()}`,
      lastContact: new Date().toISOString().split("T")[0],
    };

    const updated = [newCustomer, ...db];
    saveDb(updated);
    return newCustomer;
  },

  async updateCustomer(id: string, values: Partial<Customer>): Promise<Customer> {
    await delay();
    const db = getDb();

    let updatedCustomer: Customer | null = null;
    const updated = db.map((c) => {
      if (c.id === id) {
        updatedCustomer = { ...c, ...values };
        return updatedCustomer;
      }
      return c;
    });

    if (!updatedCustomer) {
      throw new Error(`Customer with ID ${id} not found.`);
    }

    saveDb(updated);
    return updatedCustomer;
  },

  async deleteCustomer(id: string): Promise<string> {
    await delay();
    const db = getDb();

    const exists = db.some((c) => c.id === id);
    if (!exists) {
      throw new Error(`Customer with ID ${id} not found.`);
    }

    const updated = db.filter((c) => c.id !== id);
    saveDb(updated);
    return id;
  },
};
