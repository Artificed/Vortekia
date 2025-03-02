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
import RetailManagerNavbar from "@/components/navbars/retail-manager-navbar";
import Store from "@/lib/interfaces/entities/store";
import { useGetStores } from "@/hooks/data/use-get-stores";
import { useFilterStores } from "@/hooks/data/use-filter-stores";
import { useSelectedStore } from "@/hooks/utility/use-selected-store";
import StoreActions from "@/components/partials/retail-manager/store-actions";
import StoreDetailsContent from "@/components/partials/retail-manager/store-details-context";
import StoreEditModal from "@/components/modals/store-edit-modal";

export default function StoreDashboard() {
  const { stores } = useGetStores();
  const {
    filteredStores,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  } = useFilterStores(stores);
  const { selectedStore, isEditMode, handleView, handleEdit, resetSelection } =
    useSelectedStore();

  return (
    <>
      <RetailManagerNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="text-2xl">Store Management</CardTitle>
            <CardDescription>
              View and manage all store information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search Store"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hours</SelectItem>
                    <SelectItem value="open">Currently Open</SelectItem>
                    <SelectItem value="closed">Currently Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Sales Associate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-44">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length > 0 ? (
                  filteredStores.map((store: Store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">
                        {store.name}
                      </TableCell>
                      <TableCell>{`${store.openingTime} - ${store.closingTime}`}</TableCell>
                      <TableCell>
                        {store.salesAssociate || "Not Assigned"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            isStoreOpen(store.openingTime, store.closingTime)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }
                        >
                          {isStoreOpen(store.openingTime, store.closingTime)
                            ? "Open"
                            : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StoreActions
                          store={store}
                          onView={handleView}
                          onEdit={handleEdit}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      No stores found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={selectedStore !== null && !isEditMode}
        onOpenChange={() => selectedStore && !isEditMode && resetSelection()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Store Details</DialogTitle>
            <DialogDescription>
              Complete information about this store
            </DialogDescription>
          </DialogHeader>
          {selectedStore && <StoreDetailsContent store={selectedStore} />}
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedStore !== null && isEditMode}
        onOpenChange={(open) => {
          if (!open) resetSelection();
        }}
      >
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update information about this store
            </DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <StoreEditModal
              formData={selectedStore}
              onCancel={resetSelection}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function isStoreOpen(openingTime: string, closingTime: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const currentTimeValue = currentHour * 60 + currentMinute;
  const openTimeValue = openHour * 60 + openMinute;
  const closeTimeValue = closeHour * 60 + closeMinute;

  return (
    currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue
  );
}
