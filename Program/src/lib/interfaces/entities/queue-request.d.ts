interface QueueRequest {
  id: string;
  rideId: string;
  customerId: string;
  requestTime: Date;
  approved: number;
  done: number;
}

export default QueueRequest;
