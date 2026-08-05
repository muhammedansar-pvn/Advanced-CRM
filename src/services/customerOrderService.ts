
const ORDER_KEY = "apex_crm_customer_order_v1";

function readOrder(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as string[];
  } catch {
    return null;
  }
}

function writeOrder(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDER_KEY, JSON.stringify(ids));
}

function clearOrder(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ORDER_KEY);
}

function applyOrder<T extends { id: string }>(items: T[], savedOrder: string[]): T[] {
  const orderMap = new Map(savedOrder.map((id, idx) => [id, idx]));
  return [...items].sort((a, b) => {
    const ia = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
    const ib = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
    return ia - ib;
  });
}

export const customerOrderService = {
  readOrder,
  writeOrder,
  clearOrder,
  applyOrder,
};
