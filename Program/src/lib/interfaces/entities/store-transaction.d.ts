interface StoreTransaction {
  id: string;
  souvenirId: string;
  customerId: string;
  quantity: number;
  price: number;
  transactionDate: Date;
  status: string;
}

export default StoreTransaction;
