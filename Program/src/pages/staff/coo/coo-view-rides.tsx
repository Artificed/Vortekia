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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import CooNavbar from "@/components/navbars/coo-navbar";

export default function CooViewRides() {
  const { ridesWithQueues, isLoading, isError } = useGetRidesWithQueues();
  const navigate = useNavigate();

  const navigateToDetails = (rideId: string) => {
    navigate("/coo/view-ride-detail/" + rideId);
  };

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

  return (
    <>
      <CooNavbar />
      <div className="p-32 flex justify-center items-center min-h-screen">
        <Card className="w-full h-full max-w-6xl">
          <CardHeader>
            <CardTitle>Rides Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ride Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Operating Hours</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Queue Count</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(ridesWithQueues || []).map((rideWithQueue) => (
                  <TableRow key={rideWithQueue.ride.id}>
                    <TableCell>{rideWithQueue.ride.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rideWithQueue.ride.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {rideWithQueue.ride.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rideWithQueue.ride.openingTime} -{" "}
                      {rideWithQueue.ride.closingTime}
                    </TableCell>
                    <TableCell>{rideWithQueue.ride.price}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {rideWithQueue.rideQueue?.length || "0"}
                      </Badge>
                    </TableCell>
                    <TableCell>{rideWithQueue.ride.assignedStaff}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => navigateToDetails(rideWithQueue.ride.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
