import { useState, useMemo } from "react";
import { useGetMaintenanceRequests } from "@/hooks/data/use-get-maintenance-requests";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { ToastUtils } from "@/components/utils/toast-helper";
import type MaintenanceRequest from "@/lib/interfaces/entities/maintenance-request";
import MaintenanceManagerNavbar from "@/components/navbars/maintenance-manager-navbar";
import { invoke } from "@tauri-apps/api/core";
import { CreateTaskFromRequestModal } from "@/components/modals/create-task-from-request";
import MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";

export default function ManageMaintenanceRequests() {
  const { maintenanceRequests, isLoading, isError, refetch } =
    useGetMaintenanceRequests();
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] =
    useState<keyof MaintenanceRequest>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApproveClick = () => {
    if (selectedRequest) {
      setIsDetailModalOpen(false);
      setIsTaskModalOpen(true);
    }
  };

  const handleApproveRequest = async (task: MaintenanceTask) => {
    setIsProcessing(true);
    try {
      await invoke("update_maintenance_request", {
        requestId: selectedRequest?.id,
        approved: 1,
        description: task.description,
        startTime: format(task.startTime, "yyyy-MM-dd HH:mm:ss"),
        endTime: format(task.endTime, "yyyy-MM-dd HH:mm:ss"),
        assignedStaff: task.assignedStaff,
      });

      ToastUtils.success({
        description: `Request "${selectedRequest?.title}" has been approved.`,
      });

      await refetch();
      setIsDetailModalOpen(false);
      setIsTaskModalOpen(false);
    } catch (error) {
      ToastUtils.error({
        description: String(error) || "Failed to approve request",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineRequest = async (request: MaintenanceRequest) => {
    setIsProcessing(true);
    try {
      await invoke("update_maintenance_request", {
        requestId: request.id,
        approved: -1,
      });

      ToastUtils.success({
        description: `Request "${request.title}" has been declined.`,
      });

      await refetch();
      setIsDetailModalOpen(false);
    } catch (error) {
      ToastUtils.error({
        description: String(error) || "Failed to decline request",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (request: MaintenanceRequest) => {
    if (request.approved === 1) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    } else if (request.approved === -1) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Declined
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
  };

  const filteredAndSortedRequests = useMemo(() => {
    if (!maintenanceRequests) return [];

    let filtered = [...maintenanceRequests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(query) ||
          request.content.toLowerCase().includes(query) ||
          request.id.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "approved") {
        filtered = filtered.filter((request) => request.approved === 1);
      } else if (statusFilter === "declined") {
        filtered = filtered.filter((request) => request.approved === -1);
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((request) => request.approved === 0);
      }
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
    maintenanceRequests,
    searchQuery,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceManagerNavbar />
      <main className="flex-1 container mx-auto py-6 px-4 mt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Maintenance Requests</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={`${sortField}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-");
                  setSortField(field as keyof MaintenanceRequest);
                  setSortDirection(direction as "asc" | "desc");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-red-500 mb-4 text-lg">
                Error loading maintenance requests
              </div>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedRequests.map((request) => (
                <Card key={request.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold">
                        {request.title}
                      </CardTitle>
                      {getStatusBadge(request)}
                    </div>
                    <CardDescription>
                      {format(
                        new Date(request.createdAt),
                        "MMM d, yyyy h:mm a",
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {request.content}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewRequest(request)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
              <p className="text-muted-foreground mb-4">
                No maintenance requests found
              </p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <DialogTitle className="text-2xl font-bold">
                    {selectedRequest.title}
                  </DialogTitle>
                  {getStatusBadge(selectedRequest)}
                </div>
                <DialogDescription>
                  Request ID: {selectedRequest.id} • Submitted on{" "}
                  {format(
                    new Date(selectedRequest.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedRequest.content}
                  </p>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                  disabled={isProcessing}
                >
                  Close
                </Button>

                {selectedRequest.approved === 0 && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeclineRequest(selectedRequest)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Decline Request"}
                    </Button>
                    <Button
                      onClick={handleApproveClick}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? "Processing..." : "Approve Request"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {selectedRequest && (
        <CreateTaskFromRequestModal
          request={selectedRequest}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={(task) => handleApproveRequest(task)}
          isSubmitting={isProcessing}
        />
      )}
    </div>
  );
}
