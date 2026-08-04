import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { mockCustomers } from "@/data";
import { Search } from "lucide-react";

interface CompanyFilterProps {
  selectedCompanies: string[];
  onChange: (companies: string[]) => void;
}

export const CompanyFilter = React.memo(function CompanyFilter({
  selectedCompanies,
  onChange,
}: CompanyFilterProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const allCompanies = React.useMemo(() => {
    const names = mockCustomers.map((c) => c.company);
    return Array.from(new Set(names)).sort();
  }, []);

  const filteredCompanies = React.useMemo(() => {
    if (!searchTerm.trim()) return allCompanies;
    const q = searchTerm.toLowerCase().trim();
    return allCompanies.filter((name) => name.toLowerCase().includes(q));
  }, [allCompanies, searchTerm]);

  const handleToggle = React.useCallback(
    (company: string) => {
      const next = selectedCompanies.includes(company)
        ? selectedCompanies.filter((c) => c !== company)
        : [...selectedCompanies, company];
      onChange(next);
    },
    [selectedCompanies, onChange]
  );

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Company
      </h4>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 pl-8 text-xs placeholder:text-muted-foreground bg-muted/20"
        />
      </div>
      <div className="max-h-36 overflow-y-auto border rounded-lg p-2.5 space-y-2 bg-muted/10">
        {filteredCompanies.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No companies found</p>
        ) : (
          filteredCompanies.map((company) => (
            <label
              key={company}
              className="flex items-center space-x-2.5 text-xs font-medium cursor-pointer select-none"
            >
              <Checkbox
                checked={selectedCompanies.includes(company)}
                onCheckedChange={() => handleToggle(company)}
              />
              <span className="truncate text-foreground/90">{company}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
});
CompanyFilter.displayName = "CompanyFilter";
