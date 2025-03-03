import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useGetMenuById } from "@/hooks/data/use-get-menu-by-id";
import { useGetRestaurantById } from "@/hooks/data/use-get-restaurant-by-id";
import { useGetMenus } from "@/hooks/data/use-get-menus";
import Menu from "@/lib/interfaces/entities/menu";

interface PurchaseModalProps {
  menuId: string;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (quantity: number) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  menuId,
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { menu } = useGetMenuById(menuId);

  if (!menu) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const totalPrice = menu.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {menu.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={menu.image}
              alt={menu.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">{menu.name}</h3>
              <p className="text-lg font-bold">${menu.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onPurchase(quantity)}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const menuIdParam = searchParams.get("menuId");

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(
    menuIdParam,
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const { restaurant, isLoading: isLoadingRestaurant } = useGetRestaurantById(
    id as string,
  );
  const { menus, isLoading: isLoadingMenus } = useGetMenus();

  const restaurantMenus = (menus || []).filter(
    (menu: Menu) => menu.restaurantId === id,
  );

  useEffect(() => {
    if (menuIdParam) {
      setSelectedMenuId(menuIdParam);
      setIsPurchaseModalOpen(true);
    }
  }, [menuIdParam]);

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenuId(menuId);
    setIsPurchaseModalOpen(true);
    setSearchParams({ menuId });
  };

  const handlePurchase = (quantity: number) => {
    alert(`Purchased ${quantity} items successfully!`);
    setIsPurchaseModalOpen(false);
    setSearchParams({});
  };

  if (isLoadingRestaurant) {
    return (
      <div className="container mx-auto py-6">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return <div className="container mx-auto py-6">Restaurant not found</div>;
  }

  const navigate = useNavigate();

  const handleRedirectBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        onClick={handleRedirectBack}
        variant="outline"
        className="flex items-center mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>

      <div className="relative rounded-lg overflow-hidden mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {restaurant.name}
              </h1>
              <Badge
                className="mb-2"
                variant={restaurant.isOpen ? "default" : "destructive"}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-600" />
              <span>
                {restaurant.openingTime} - {restaurant.closingTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Cuisine Type:</span>{" "}
                {restaurant.cuisineType}
              </div>
              <div>
                <span className="font-medium">Hours:</span>{" "}
                {restaurant.openingTime} - {restaurant.closingTime}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <Badge variant={restaurant.isOpen ? "default" : "destructive"}>
                  {restaurant.isOpen ? "Open for Orders" : "Currently Closed"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
      {isLoadingMenus ? (
        <div>Loading menu items...</div>
      ) : restaurantMenus && restaurantMenus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantMenus.map((menu) => (
            <Card
              key={menu.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMenuSelect(menu.id)}
            >
              <CardHeader className="p-0">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle>{menu.name}</CardTitle>
                <p className="mt-2 font-bold text-lg">
                  ${menu.price.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuSelect(menu.id);
                  }}
                >
                  Order Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg">No menu items available for this restaurant</p>
        </div>
      )}

      {/* Purchase Modal */}
      {selectedMenuId && (
        <PurchaseModal
          menuId={selectedMenuId}
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setSearchParams({});
          }}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default RestaurantDetailPage;
