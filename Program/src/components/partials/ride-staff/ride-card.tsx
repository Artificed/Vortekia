import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";

interface RideCardProps {
  rideWithStaff: RideWithStaff;
  onDetailsClick: (ride: RideWithStaff) => void;
}

export default function RideCard({
  rideWithStaff,
  onDetailsClick,
}: RideCardProps) {
  const { ride } = rideWithStaff;

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5);
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-48 w-full mt-8 overflow-hidden relative">
        <img
          src={ride.image}
          alt={ride.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={ride.status === "Closed" ? "destructive" : "default"}>
            {ride.status || "Open"}
          </Badge>
        </div>
      </div>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-xl">{ride.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="text-gray-600">
          <p>Ticket Price: ${parseFloat(ride.price).toFixed(2)}</p>
          <p className="mt-2">ID: {ride.id}</p>
          <p className="my-2">
            Ride Schedule: {formatTime(ride.openingTime)} -{" "}
            {formatTime(ride.closingTime)}
          </p>
          <p>Assigned Staff: {ride.assignedStaff || "None"}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="default"
          className="w-full"
          onClick={() => onDetailsClick(rideWithStaff)}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
