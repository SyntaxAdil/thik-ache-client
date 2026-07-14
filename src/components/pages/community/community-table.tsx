// components/community/community-table.tsx
"use client";

import React from "react";
import { ReusableTablePagination as TablePagination } from "@/components/shared/table-pagination";
import { communityColumns, MemberLog } from "./community-columns";

interface CommunityTableProps {
  data: MemberLog[];
  pageSize?: number;
  emptyMessage?: string;
}

export function CommunityTable({
  data,
  pageSize = 4,
  emptyMessage = "No community members registered yet.",
}: CommunityTableProps) {
  return (
    <TablePagination
      data={data}
      columns={communityColumns}
      pageSize={pageSize}
      emptyMessage={emptyMessage}
    />
  );
}