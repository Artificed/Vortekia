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
import RideManagerNavbar from "@/components/navbars/ride-manager-navbar";
import RideDetailsModal from "@/components/modals/ride-details-modal";
import EditRideForm from "@/components/modals/edit-ride-modal";

export default function RideManagerDashboard() {
  const { rides } = useGetRides();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);

  const filteredRides =
    rides?.filter((ride: Ride) =>
      ride.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleEditRide = (ride: Ride) => {
    setSelectedRide(ride);
    setIsEditFormOpen(true);
  };

  const handleCloseAll = useCallback(() => {
    setSelectedRide(null);
    setIsEditFormOpen(false);
  }, []);

  const handleSuccessfulSubmit = useCallback(() => {
    handleCloseAll();
  }, [handleCloseAll]);

  return (
    <>
      <RideManagerNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ride Manager Dashboard</h1>
          <Button>Add New Ride</Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride: Ride) => (
              <Card key={ride.id} className="overflow-hidden flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
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
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-xl">{ride.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-grow">
                  <div className="text-gray-600">
                    <p>Ticket Price: ${ride.price.toLocaleString()}</p>
                    <p className="my-2">ID: {ride.id}</p>
                    <p>Assigned Staff: {ride.assignedStaff}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedRide(ride)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => handleEditRide(ride)}
                  >
                    Manage
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

        {selectedRide && !isEditFormOpen && (
          <RideDetailsModal
            ride={selectedRide}
            onClose={handleCloseAll}
            onEdit={() => setIsEditFormOpen(true)}
          />
        )}

        {selectedRide && isEditFormOpen && (
          <EditRideForm
            ride={selectedRide}
            onClose={handleCloseAll}
            onSuccess={handleSuccessfulSubmit}
          />
        )}
      </div>
    </>
  );
}
