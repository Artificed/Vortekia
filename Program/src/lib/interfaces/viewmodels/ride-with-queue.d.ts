import Ride from "../entities/ride";
import RideQueue from "../entities/ride-queue";

interface RideWithQueue {
  ride: Ride;
  rideQueue: RideQueue[];
}

export default RideWithQueue;
