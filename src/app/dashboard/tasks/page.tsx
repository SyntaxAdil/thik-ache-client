// app/my-tasks/page.tsx
import React from "react";
import { headers } from "next/headers";
import { helpRequestService } from "../../../services";
import { ReusableTablePagination } from "../../../components/shared/table-pagination";
import { auth } from "../../../lib/auth/auth";
import { taskColumns, Task } from "../../../components/pages/dashboard/tasks/task-columns";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "My Tasks",
  description: "View all the tasks you have completed.",
};
export default async function MyTasks() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 p-12 text-center">
            <p className="text-zinc-400">Please login to view your tasks</p>
          </div>
        </div>
      </main>
    );
  }

  let allTasks: Task[] = [];

  try {
    const [helpingResponse, postedResponse] = await Promise.all([
      helpRequestService.getMyHelpingRequests(),
      helpRequestService.getMyPostedRequests(),
    ]);

    const helpingTasks = Array.isArray(helpingResponse)
      ? (helpingResponse as Task[])
      : [];
    const postedTasks = Array.isArray(postedResponse)
      ? (postedResponse as Task[])
      : [];

    allTasks = [...helpingTasks, ...postedTasks];
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }

  return (
    <main className="min-h-screen w-full bg-black text-zinc-100 py-8 tracking-tight">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Tasks</h1>
            <p className="text-xs text-zinc-500 mt-1.5 font-medium">
              {allTasks.length} {allTasks.length === 1 ? "task" : "tasks"} in
              total
            </p>
          </div>

          <ReusableTablePagination
            data={allTasks}
            columns={taskColumns}
            pageSize={5}
            emptyMessage="No tasks found. Start helping others by exploring available requests."
          />
        </div>
      </div>
    </main>
  );
}