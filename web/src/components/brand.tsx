"use client";

import { Avatar, AvatarImage } from "@web/components/common/avatar";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex gap-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src="logo.svg" alt="Homagochi" />
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Homagochi</span>
        <span className="truncate text-xs">Foreclosed properties</span>
      </div>
    </Link>
  );
}
