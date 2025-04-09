"use client";

import { Search } from "lucide-react";

import { Label } from "@web/components/common/label";
import { SidebarInput } from "@web/components/common/sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const [search, setQuery] = useState(searchParams.get("search") || "");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    params.delete("after");
    params.delete("before");

    push(`${pathname}?${params.toString()}`);
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7"
          value={search}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  );
}
