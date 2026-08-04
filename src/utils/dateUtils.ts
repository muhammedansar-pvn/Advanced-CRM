export function parseDateString(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "All time";

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
  if (start) return `Since ${formatDate(start)}`;
  return `Before ${formatDate(end)}`;
}

export function isDateWithinRange(dateString: string, start: string, end: string): boolean {
  if (!dateString) return false;

  // Simple string date parsing comparison to avoid timezone shift issues (e.g. comparing "2026-08-01" to "2026-08-02")
  const itemDate = dateString.split("T")[0];

  if (start) {
    const startDate = start.split("T")[0];
    if (itemDate < startDate) return false;
  }

  if (end) {
    const endDate = end.split("T")[0];
    if (itemDate > endDate) return false;
  }

  return true;
}
