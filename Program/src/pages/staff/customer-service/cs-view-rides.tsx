import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Ride from "@/lib/interfaces/entities/ride";
import { useGetRides } from "@/hooks/data/use-get-rides";
import RideDetailsModal from "@/components/modals/ride-details-modal";
import EditRideModal from "@/components/modals/edit-ride-modal";
import DeleteRideModal from "@/components/modals/delete-ride-modal";
import CustomerServiceNavbar from "@/components/navbars/customer-service-navbar";

export default function CsViewRides() {
  const { rides } = useGetRides();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [isDeleteFormOpen, setIsDeleteFormOpen] = useState<boolean>(false);

  const filteredRides =
    rides?.filter((ride: Ride) =>
      ride.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleCloseAll = useCallback(() => {
    setSelectedRide(null);
    setIsEditFormOpen(false);
    setIsDeleteFormOpen(false);
  }, []);

  const handleSuccessfulSubmit = useCallback(() => {
    handleCloseAll();
  }, [handleCloseAll]);

  return (
    <>
      <CustomerServiceNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="mt-10 mb-6">
          <Input
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride: Ride) => (
              <Card key={ride.id} className="overflow-hidden flex flex-col">
                <div className="h-48 w-full overflow-hidden relative px-4">
                  <img
                    src={ride.image}
                    alt={ride.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={
                        ride.status === "Closed" ? "destructive" : "default"
                      }
                    >
                      {ride.status || "Open"}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="px-4 py-0">
                  <CardTitle className="text-xl">{ride.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <div className="text-gray-600">
                    <p>Ticket Price: ${ride.price.toLocaleString()}</p>
                    <p className="mt-2">ID: {ride.id}</p>
                    <p className="my-2">
                      Ride Schedule: {ride.openingTime.substring(0, 5)} -{" "}
                      {ride.closingTime.substring(0, 5)}
                    </p>
                    <p>Assigned Staff: {ride.assignedStaff ?? "-"}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 py-0 flex justify-between">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setSelectedRide(ride)}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "No rides match your search."
                  : "No rides available."}
              </p>
            </div>
          )}
        </div>

        {selectedRide && !isEditFormOpen && !isDeleteFormOpen && (
          <RideDetailsModal
            ride={selectedRide}
            onClose={handleCloseAll}
            onEdit={() => setIsEditFormOpen(true)}
            onDelete={() => setIsDeleteFormOpen(true)}
          />
        )}

        {selectedRide && isEditFormOpen && !isDeleteFormOpen && (
          <EditRideModal
            ride={selectedRide}
            onClose={handleCloseAll}
            onSuccess={handleSuccessfulSubmit}
          />
        )}

        {selectedRide && !isEditFormOpen && isDeleteFormOpen && (
          <DeleteRideModal
            rideId={selectedRide.id}
            onClose={handleCloseAll}
            onSuccess={handleSuccessfulSubmit}
          />
        )}
      </div>
    </>
  );
}
