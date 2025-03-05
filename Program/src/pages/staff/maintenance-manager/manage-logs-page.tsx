import { useState, useMemo } from "react";
import { useGetMaintenanceLogs } from "@/hooks/data/use-get-maintenance-logs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { RefreshCw, Search, Check, X } from "lucide-react";
import { ToastUtils } from "@/components/utils/toast-helper";
import type MaintenanceLog from "@/lib/interfaces/entities/maintenance-log";
import MaintenanceManagerNavbar from "@/components/navbars/maintenance-manager-navbar";
import { invoke } from "@tauri-apps/api/core";
import { useQueryClient } from "@tanstack/react-query";

export default function MaintenanceLogsPage() {
  const { maintenanceLogs, isLoading, isError, refetch } =
    useGetMaintenanceLogs();

  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [completionFilter, setCompletionFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof MaintenanceLog>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient();

  const handleSort = (field: keyof MaintenanceLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedLogs = useMemo(() => {
    if (!maintenanceLogs) return [];

    let filtered = [...maintenanceLogs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          log.id.toLowerCase().includes(query) ||
          log.taskId.toLowerCase().includes(query),
      );
    }

    if (approvalFilter !== "all") {
      const isApproved = approvalFilter === "approved";
      filtered = filtered.filter((log) =>
        isApproved ? log.approved === 1 : log.approved === 0,
      );
    }

    if (completionFilter !== "all") {
      const isDone = completionFilter === "completed";
      filtered = filtered.filter((log) =>
        isDone ? log.done === 1 : log.done === 0,
      );
    }

    filtered.sort((a, b) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        const valueA = String(a[sortField] || "");
        const valueB = String(b[sortField] || "");
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

    return filtered;
  }, [
    maintenanceLogs,
    searchQuery,
    approvalFilter,
    completionFilter,
    sortField,
    sortDirection,
  ]);

  const manageSubmission = async (logId: string, approved: number) => {
    try {
      await invoke("update_maintenance_log", { logId, approved });
      ToastUtils.success({
        description: "Successfully approved/rejected report!",
      });
      queryClient.invalidateQueries({ queryKey: ["maintenanceLogs"] });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceManagerNavbar />
      <main className="flex-1 container mx-auto py-6 px-4 mt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Maintenance Logs</h1>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by approval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Approvals</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={completionFilter}
                onValueChange={setCompletionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by completion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Completion</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={`${sortField}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-");
                  setSortField(field as keyof MaintenanceLog);
                  setSortDirection(direction as "asc" | "desc");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="taskId-asc">Task ID (A-Z)</SelectItem>
                  <SelectItem value="taskId-desc">Task ID (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-red-500 mb-4 text-lg">
                Error loading maintenance logs
              </div>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedLogs.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      Log ID
                      {sortField === "id" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("taskId")}
                    >
                      Task ID
                      {sortField === "taskId" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Created At
                      {sortField === "createdAt" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.taskId}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {log.message}
                      </TableCell>
                      <TableCell>
                        {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Badge
                            variant={log.approved ? "default" : "outline"}
                            className="whitespace-nowrap"
                          >
                            {log.approved ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            {log.approved ? "Approved" : "Pending"}
                          </Badge>
                          <Badge>
                            {log.done ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Button onClick={() => manageSubmission(log.id, 1)}>
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => manageSubmission(log.id, 0)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
              <p className="text-muted-foreground mb-4">
                No maintenance logs found
              </p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
