interface RestaurantProposal {
  id: string;
  name: string;
  image: string;
  openingTime: string;
  closingTime: string;
  cuisineType: string;
  cfoApproved: number;
  cfoDone: number;
  ceoApproved: number;
  ceoDone: number;
}

export default RestaurantProposal;
