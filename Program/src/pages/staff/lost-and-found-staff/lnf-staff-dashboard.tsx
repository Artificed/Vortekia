import LnfStaffNavbar from "@/components/navbars/lnf-staff-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { useFilterLnfLogs } from "@/hooks/data/use-filter-lnf-logs";
import { useGetLnfLogs } from "@/hooks/data/use-get-lnf-logs";
import { useGetLnfBadge } from "@/hooks/utility/use-get-lnf-badge";
import { useState } from "react";

export default function LnfStaffDashboard() {
  const { lnfLogs, isLoading, isError } = useGetLnfLogs();
  const {
    filteredLogs,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  } = useFilterLnfLogs(lnfLogs);
  const { getBadgeColor } = useGetLnfBadge();
  const [selectedItem, setSelectedItem] = useState<LnfLog | null>(null);

  if (isLoading) {
    return (
      <>
        <LnfStaffNavbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-6xl">
            <CardContent className="p-8 text-center">
              Loading lost and found logs...
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <LnfStaffNavbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-6xl">
            <CardContent className="p-8 text-center text-red-600">
              Error loading lost and found logs. Please try again later.
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <LnfStaffNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="text-2xl">Lost and Found Logs</CardTitle>
            <CardDescription>
              View and manage all lost and found items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search Item"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Missing">Missing</SelectItem>
                    <SelectItem value="Found">Found</SelectItem>
                    <SelectItem value="Claimed">Claimed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log: LnfLog) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.name}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.color}</TableCell>
                      <TableCell>{log.lastSeenLocation}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedItem(log)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Item Details</DialogTitle>
                              <DialogDescription>
                                Complete information about this lost and found
                                item
                              </DialogDescription>
                            </DialogHeader>
                            {selectedItem && (
                              <div className="space-y-4 py-4">
                                <div className="flex justify-center mb-4">
                                  <img
                                    src={selectedItem.image}
                                    alt={selectedItem.name}
                                    className="rounded-md max-h-64 object-contain"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Name
                                    </p>
                                    <p>{selectedItem.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Type
                                    </p>
                                    <p>{selectedItem.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Color
                                    </p>
                                    <p>{selectedItem.color}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Status
                                    </p>
                                    <Badge
                                      className={getBadgeColor(
                                        selectedItem.status,
                                      )}
                                    >
                                      {selectedItem.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Last Seen
                                    </p>
                                    <p>{selectedItem.lastSeenLocation}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Owner ID
                                    </p>
                                    <p>{selectedItem.owner}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Finder ID
                                    </p>
                                    <p>{selectedItem.finder || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Item ID
                                    </p>
                                    <p>{selectedItem.id}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No lost and found items found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
