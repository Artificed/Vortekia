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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFilterLnfLogs } from "@/hooks/data/use-filter-lnf-logs";
import { useGetLnfLogs } from "@/hooks/data/use-get-lnf-logs";
import { useGetLnfBadge } from "@/hooks/utility/use-get-lnf-badge";
import { useSelectedLnfItem } from "@/hooks/utility/use-selected-lnf-item";
import ItemDetailsContent from "@/components/partials/lost-and-found-staff/item-details-content";
import ItemActions from "@/components/partials/lost-and-found-staff/item-actions";
import LnfLoadingState from "@/components/partials/lost-and-found-staff/lnf-loading-state";
import LnfErrorState from "@/components/partials/lost-and-found-staff/lnf-error-state";
import LnfLogEditModal from "@/components/modals/lnf-log-edit-modal";

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
  const { selectedItem, isEditMode, handleView, handleEdit, resetSelection } =
    useSelectedLnfItem();

  if (isLoading) return <LnfLoadingState />;
  if (isError) return <LnfErrorState />;

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
                    <SelectItem value="Returned To Owner">
                      Returned To Owner
                    </SelectItem>
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
                  <TableHead className="text-center w-44">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
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
                      <TableCell>
                        <ItemActions
                          item={log}
                          onView={handleView}
                          onEdit={handleEdit}
                        />
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

      <Dialog
        open={selectedItem !== null && !isEditMode}
        onOpenChange={() => selectedItem && !isEditMode && resetSelection()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>
              Complete information about this lost and found item
            </DialogDescription>
          </DialogHeader>
          {selectedItem && <ItemDetailsContent item={selectedItem} />}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedItem !== null && isEditMode}
        onOpenChange={(open) => {
          if (!open) resetSelection();
        }}
      >
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update information about this lost and found item
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <LnfLogEditModal
              formData={selectedItem}
              onCancel={resetSelection}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
