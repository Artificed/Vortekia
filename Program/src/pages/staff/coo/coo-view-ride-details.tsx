import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRidesWithQueues } from "@/hooks/data/use-get-rides-with-queues";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router";
import CooNavbar from "@/components/navbars/coo-navbar";

export default function CooViewRideDetails() {
  const { ridesWithQueues, isLoading, isError } = useGetRidesWithQueues();
  const params = useParams();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Badge variant="destructive">Error loading rides</Badge>
      </div>
    );
  }

  const selectedRide = ridesWithQueues?.find(
    (rideWithQueue) => rideWithQueue.ride.id === params.rideId,
  );

  return (
    <>
      <CooNavbar />
      <div className="p-4 md:p-8 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl">Ride Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedRide && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">
                      {selectedRide.ride.name} Details
                    </h2>
                    <Badge
                      variant={
                        selectedRide.ride.status === "Active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedRide.ride.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Price:</p>
                          <p className="text-muted-foreground">
                            {selectedRide.ride.price}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Operating Hours:</p>
                          <p className="text-muted-foreground">
                            {selectedRide.ride.openingTime} -{" "}
                            {selectedRide.ride.closingTime}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Assigned Staff:</p>
                          <p className="text-muted-foreground">
                            {selectedRide.ride.assignedStaff}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedRide.ride.image && (
                      <img
                        src={selectedRide.ride.image}
                        alt={selectedRide.ride.name}
                        className="w-full h-48 md:h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Current Queue</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Customer ID</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRide.rideQueue?.length > 0 ? (
                        selectedRide.rideQueue.map((queueEntry) => (
                          <TableRow key={queueEntry.id}>
                            <TableCell className="font-medium">
                              {queueEntry.customerId}
                            </TableCell>
                            <TableCell>
                              {queueEntry.startTime.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {queueEntry.endTime.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No customers in queue
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
