"use client";

import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/context/search-provider";
import { Button } from "./ui/button";

type SearchProps = {
  className?: string;
  placeholder?: string;
};

export function Search({
  className = "", placeholder ="Search",
}: SearchProps) {
  const { setOpen } = useSearch();
  return (
    <Button
      variant="outline"
      className={cn(
        "bg-muted text-muted-foreground hover:bg-accent group relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64",
        className,
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden="true"
        className="absolute left-1.5 top-1/2 h-4 w-4 -translate-y-1/2"
      />
      <span className="ml-4">{placeholder}</span>
      <kbd className="bg-muted group-hover:bg-accent pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
