import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";
import { useGetRestaurantById } from "@/hooks/data/use-get-restaurant-by-id";
import Menu from "@/lib/interfaces/entities/menu";
import { useGetMenus } from "@/hooks/data/use-get-menus";
import PurchaseModal from "@/components/modals/restaurant-purchase-modal";
import RestaurantNavbar from "@/components/navbars/restaurant-navbar";
import useAuth from "@/hooks/auth/use-auth";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const restaurantId = id || "";
  const menuIdParam = searchParams.get("menuId");

  const auth = useAuth();

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(
    menuIdParam,
  );
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const { restaurant, isLoading: isLoadingRestaurant } =
    useGetRestaurantById(restaurantId);
  const { menus, isLoading: isLoadingMenus } = useGetMenus();

  const restaurantMenus =
    menus?.filter((menu: Menu) => menu.restaurantId === restaurantId) || [];

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

  const handlePurchase = async (quantity: number) => {
    const selectedMenu = restaurantMenus.find(
      (menu) => menu.id === selectedMenuId,
    );

    if (!selectedMenu) {
      ToastUtils.error({ description: "Menu must be selected!" });
      return;
    }

    try {
      await invoke("insert_restaurant_transaction", {
        menuId: selectedMenu.id,
        customerId: auth?.user?.id,
        quantity: quantity,
        price: -selectedMenu.price,
      });
      ToastUtils.success({ description: "Successfully bought item!" });
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    }

    setIsPurchaseModalOpen(false);
    setSearchParams({});
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (isLoadingRestaurant) {
    return (
      <div className="container mx-auto py-6 mt-20">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto py-6 mt-20">Restaurant not found</div>
    );
  }

  return (
    <>
      <RestaurantNavbar />
      <div className="container mx-auto py-6 pt-24">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>

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
                  <Badge
                    variant={restaurant.isOpen ? "default" : "destructive"}
                  >
                    {restaurant.isOpen ? "Open for Orders" : "Currently Closed"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        {isLoadingMenus ? (
          <div>Loading menu items...</div>
        ) : restaurantMenus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantMenus.map((menu) => (
              <Card key={menu.id} className="hover:shadow-lg transition-shadow">
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
                {auth?.user && (
                  <CardFooter>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuSelect(menu.id);
                      }}
                      className="cursor-pointer"
                    >
                      Order Now
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-lg">
              No menu items available for this restaurant
            </p>
          </div>
        )}

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
    </>
  );
};

export default RestaurantDetailPage;
