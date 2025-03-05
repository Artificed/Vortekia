interface RideTransaction {
  id: string;
  customerId: string;
  rideId: string;
  ridePrice: number;
  transactionDate: Date;
  status: string;
}

export default RideTransaction;
