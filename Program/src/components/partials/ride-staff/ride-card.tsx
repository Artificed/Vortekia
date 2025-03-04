import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";

interface RideCardProps {
  rideWithStaff: RideWithStaff;
  onDetailsClick: (rideWithStaff: RideWithStaff) => void;
  onManageQueue: (rideWithStaff: RideWithStaff) => void;
}

export default function RideCard({
  rideWithStaff,
  onDetailsClick,
  onManageQueue,
}: RideCardProps) {
  const { ride, staff } = rideWithStaff;

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-grow p-4">
        <div className="relative mb-4">
          <img
            src={ride.image}
            alt={ride.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <Badge
            variant={ride.status === "Closed" ? "destructive" : "default"}
            className="absolute top-2 right-2"
          >
            {ride.status || "Open"}
          </Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{ride.name}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              Hours: {ride.openingTime} - {ride.closingTime}
            </p>
            <p>Price: ${parseFloat(ride.price).toFixed(2)}</p>
            <p>Staff: {staff ? staff.username : "No staff assigned"}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onDetailsClick(rideWithStaff)}
        >
          Details
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={() => onManageQueue(rideWithStaff)}
        >
          Manage Queue
        </Button>
      </CardFooter>
    </Card>
  );
}
