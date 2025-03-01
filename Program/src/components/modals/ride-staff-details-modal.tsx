import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";

interface RideDetailsDialogProps {
  rideWithStaff: RideWithStaff | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RideStaffDetailsModal({
  rideWithStaff,
  isOpen,
  onOpenChange,
}: RideDetailsDialogProps) {
  if (!rideWithStaff) return null;

  const { ride, staff } = rideWithStaff;

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5);
  };

  const formatShiftTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            {ride.name}
            <Badge
              variant={ride.status === "Closed" ? "destructive" : "default"}
            >
              {ride.status || "Open"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={ride.image}
                alt={ride.name}
                className="w-full h-auto object-cover rounded-md shadow"
              />
            </div>
            <div className="flex flex-col justify-center space-y-3">
              <h3 className="font-semibold text-lg">Ride Information</h3>
              <p className="text-sm">
                <span className="font-medium">ID:</span> {ride.id}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ticket Price:</span> $
                {parseFloat(ride.price).toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Hours:</span>{" "}
                {formatTime(ride.openingTime)} - {formatTime(ride.closingTime)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {ride.status}
              </p>
              <p className="text-sm">
                <span className="font-medium">Assigned Staff:</span>{" "}
                {ride.assignedStaff || "None"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Staff Details</h3>
            {staff ? (
              <div className="max-h-64 overflow-y-auto pr-2 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Shift</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow key={staff.id}>
                      <TableCell>{staff.username}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        {formatShiftTime(staff.shiftStart)} -{" "}
                        {formatShiftTime(staff.shiftEnd)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">No staff assigned to this ride.</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between mt-4">
          <div className="flex gap-2 mb-2 sm:mb-0"></div>
          <div className="flex gap-2">
            <Button variant="destructive">
              {ride.status === "Closed" ? "Open Ride" : "Close Ride"}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
