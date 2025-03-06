interface RestaurantTransaction {
  id: string;
  menuId: string;
  restaurantId: string;
  customerId: string;
  quantity: number;
  price: number;
  transactionDate: Date;
  status: string;
}

export default RestaurantTransaction;
