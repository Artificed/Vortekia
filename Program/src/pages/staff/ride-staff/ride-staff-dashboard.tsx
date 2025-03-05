import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetRideWithStaff } from "@/hooks/data/use-get-ride-with-staff";
import RideWithStaff from "@/lib/interfaces/viewmodels/ride-with-staff";
import RideCard from "@/components/partials/ride-staff/ride-card";
import RideStaffDetailsModal from "@/components/modals/ride-staff-details-modal";
import RideQueueModal from "@/components/modals/ride-queue-modal";
import RideStaffNavbar from "@/components/navbars/ride-staff-navbar";

export default function RideStaffDashboard() {
  const { ridesWithStaff } = useGetRideWithStaff();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState<RideWithStaff | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  const filteredRides =
    ridesWithStaff?.filter((rideWithStaff: RideWithStaff) =>
      rideWithStaff.ride.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleDetailsClick = (ride: RideWithStaff) => {
    setSelectedRide(ride);
    setIsDetailsOpen(true);
  };

  const handleManageQueue = (ride: RideWithStaff) => {
    setSelectedRide(ride);
    setIsQueueOpen(true);
  };

  return (
    <>
      <RideStaffNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button>Add New Ride</Button>
        </div>
        <div className="mt-10 mb-6">
          <Input
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        {filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRides.map((rideWithStaff: RideWithStaff) => (
              <RideCard
                key={rideWithStaff.ride.id}
                rideWithStaff={rideWithStaff}
                onDetailsClick={handleDetailsClick}
                onManageQueue={handleManageQueue}
              />
            ))}
          </div>
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
      <RideStaffDetailsModal
        rideWithStaff={selectedRide}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      <RideQueueModal
        rideWithStaff={selectedRide}
        isOpen={isQueueOpen}
        onOpenChange={setIsQueueOpen}
      />
    </>
  );
}
