interface RestaurantTransaction {
  id: string;
  menuId: string;
  customerId: string;
  quantity: number;
  price: number;
  transactionDate: Date;
}

export default RestaurantTransaction;
