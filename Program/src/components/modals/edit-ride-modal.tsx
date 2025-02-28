import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRideStaffs } from "@/hooks/data/use-get-ride-staffs";
import Ride from "@/lib/interfaces/entities/ride";
import { useEditRideForm } from "@/hooks/forms/use-edit-ride-form";

interface EditRideFormProps {
  ride: Ride;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditRideForm({
  ride,
  onClose,
  onSuccess,
}: EditRideFormProps) {
  const { rideStaffs } = useGetRideStaffs();
  const {
    formData,
    handleChange,
    handleStatusChange,
    handleStaffChange,
    handleSubmit,
  } = useEditRideForm({ ride, onClose, onSuccess });

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Ride: {ride.name}</CardTitle>
              <Button
                variant="ghost"
                className="mt-5"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ride Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  className="opacity-50 cursor-not-allowed pointer-events-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Ticket Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedStaff">Assigned Staff</Label>
                <Select
                  value={formData.assignedStaff}
                  onValueChange={handleStaffChange}
                >
                  <SelectTrigger id="assignedStaff">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {rideStaffs?.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.username}
                      </SelectItem>
                    ))}
                    {(!rideStaffs || rideStaffs.length === 0) && (
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        No staff members available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ride Image</Label>
              {formData.image && (
                <div className="mt-4 aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={formData.image}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 mt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
