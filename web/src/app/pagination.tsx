"use client";

import { PageInfo__Output } from "@web/protobuf/common/PageInfo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@web/components/common/button";

export function Pagination({
  pageInfo,
}: {
  pageInfo: PageInfo__Output | null;
}) {
  const searchParams = useSearchParams();

  const prevParams = new URLSearchParams(searchParams);
  if (pageInfo?.hasPrevPage) prevParams.set("before", pageInfo.startCursor);

  const nextParams = new URLSearchParams(searchParams);
  if (pageInfo?.hasNextPage) nextParams.set("after", pageInfo.endCursor);

  return (
    <div className="flex gap-1">
      {pageInfo?.hasPrevPage && (
        <Button asChild size="sm">
          <Link href={`?${prevParams.toString()}`}>
            <ArrowLeft />
          </Link>
        </Button>
      )}
      {pageInfo?.hasNextPage && (
        <Button asChild size="sm">
          <Link href={`?${nextParams.toString()}`}>
            <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
}
