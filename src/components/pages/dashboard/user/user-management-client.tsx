// components/user/user-management-client.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, X, Trash2, Eye } from "lucide-react";
import { ReusableTablePagination, Column } from "@/components/shared/table-pagination";
import { UserData, userColumns } from "./user-columns";
import { UserDeleteModal } from "./user-delete-modal";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

interface UserManagementClientProps {
  initialUsers: UserData[];
  currentUserId: string;
}

export function UserManagementClient({
  initialUsers,
  currentUserId,
}: UserManagementClientProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.area?.toLowerCase().includes(query)
      );
    }

    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    return filtered;
  }, [users, searchQuery, filterRole]);

  const handleDeleteUser = async (userId: string) => {
    await userService.deleteUser(userId);
    setUsers(users.filter((u) => u._id !== userId));
  };

  const handleDeleteClick = (user: UserData) => {
    if (user._id === currentUserId) {
      toast.error("You cannot delete your own account");
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRole(null);
  };

  const columnsWithActions: Column<UserData>[] = [
    ...userColumns,
    {
      header: "Actions",
      render: (row: UserData) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/dashboard/users/${row._id}`}>
            <button className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            className={`p-2 rounded-lg transition-colors ${
              row._id === currentUserId
                ? "opacity-50 cursor-not-allowed bg-zinc-900/50 text-zinc-600"
                : "bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
            }`}
            disabled={row._id === currentUserId}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const roleOptions = ["user", "admin"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            User Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 font-medium">
            {filteredUsers.length} of {users.length} total users
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Search by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border transition-all text-sm font-medium flex items-center gap-2 ${
              showFilters || filterRole !== null
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                : "bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {filterRole !== null && (
              <span className="ml-1 px-1.5 py-0.5 bg-indigo-600/40 rounded text-xs">
                {filterRole}
              </span>
            )}
          </button>

          {(searchQuery || filterRole !== null) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl border border-zinc-900 bg-zinc-950/60 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1.5"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Role:
          </span>
          {roleOptions.map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(filterRole === role ? null : role)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterRole === role
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-transparent"
              }`}
            >
              {role}
            </button>
          ))}
          {filterRole !== null && (
            <button
              onClick={() => setFilterRole(null)}
              className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="text-xs text-zinc-500">
        Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        {searchQuery && ` matching "${searchQuery}"`}
        {filterRole !== null && ` with role "${filterRole}"`}
      </div>

      <ReusableTablePagination
        data={filteredUsers}
        columns={columnsWithActions}
        pageSize={10}
        emptyMessage="No users match your search criteria."
      />

      <UserDeleteModal
        user={selectedUser}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}