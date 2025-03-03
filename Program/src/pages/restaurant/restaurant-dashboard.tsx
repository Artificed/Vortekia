import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router";
import { useGetRestaurants } from "@/hooks/data/use-get-restaurants";
import { useGetMenus } from "@/hooks/data/use-get-menus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RestaurantNavbar from "@/components/navbars/restaurant-navbar";

export default function RestaurantDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  const restaurantData = useGetRestaurants();
  const menuData = useGetMenus();

  const filteredRestaurants = restaurantData.restaurants?.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (cuisineFilter === "" || restaurant.cuisineType === cuisineFilter),
  );

  const filteredMenus = menuData.menus?.filter((menu) =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedMenus =
    filteredMenus && priceSort
      ? [...filteredMenus].sort((a, b) =>
          priceSort === "asc" ? a.price - b.price : b.price - a.price,
        )
      : filteredMenus;

  const cuisineTypes = restaurantData.restaurants
    ? [...new Set(restaurantData.restaurants.map((r) => r.cuisineType))]
    : [];

  return (
    <>
      <RestaurantNavbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 mt-20">Restaurant Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 text-gray-500" />
            <Input
              placeholder="Search restaurants and menus..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={cuisineFilter === "" ? "all" : cuisineFilter}
            onValueChange={(value) =>
              setCuisineFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-80 p-2 border rounded-md">
              <SelectValue placeholder="All Cuisines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuisines</SelectItem>
              {cuisineTypes.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priceSort === null ? "none" : priceSort}
            onValueChange={(value) =>
              setPriceSort(value === "none" ? null : (value as "asc" | "desc"))
            }
          >
            <SelectTrigger className="w-80 p-2 border rounded-md">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sort by Price</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for Restaurants and Menus */}
        <Tabs defaultValue="restaurants" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="menus">Menus</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants">
            {restaurantData.isLoading ? (
              <div>Loading restaurants...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants?.map((restaurant) => (
                  <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <CardTitle className="flex justify-between items-center">
                          <span>{restaurant.name}</span>
                          <Badge
                            variant={
                              restaurant.isOpen ? "default" : "destructive"
                            }
                          >
                            {restaurant.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center mt-2 text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {restaurant.openingTime} - {restaurant.closingTime}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Badge variant="outline" className="bg-gray-100">
                          {restaurant.cuisineType}
                        </Badge>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}

                {filteredRestaurants?.length === 0 && (
                  <div className="col-span-3 text-center py-10">
                    <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-lg">No restaurants found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="menus">
            {menuData.isLoading ? (
              <div>Loading menus...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMenus?.map((menu) => (
                  <Link
                    to={`/restaurant/${menu.restaurantId}?menuId=${menu.id}`}
                    key={menu.id}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <CardTitle>{menu.name}</CardTitle>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-lg">
                            ${menu.price.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {sortedMenus?.length === 0 && (
                  <div className="col-span-3 text-center py-10">
                    <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-lg">No menus found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
