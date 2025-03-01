import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Ride from "@/lib/interfaces/entities/ride";

interface RideDetailsModalProps {
  ride: Ride;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RideDetailsModal({
  ride,
  onClose,
  onEdit,
  onDelete,
}: RideDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{ride.name}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-md">
            <img
              src={ride.image}
              alt={ride.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ride ID</h3>
              <p className="mt-1">{ride.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Ticket Price
              </h3>
              <p className="mt-1">${ride.price.toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Current Status
              </h3>
              <div className="mt-1 flex items-center">
                <Badge
                  variant={ride.status === "Closed" ? "destructive" : "default"}
                >
                  {ride.status || "Open"}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Opening Time
              </h3>
              <p className="mt-1">{ride.openingTime.substring(0, 5) ?? "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Closing Time
              </h3>
              <p className="mt-1">{ride.closingTime.substring(0, 5) ?? "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Assigned Staff
              </h3>
              <p className="mt-1">{ride.assignedStaff ?? "-"}</p>
            </div>
          </div>

          <div className="flex justify-between pt-5">
            <Button variant="destructive" onClick={onDelete}>
              Delete Ride
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="default" onClick={onEdit}>
                Edit Ride
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
