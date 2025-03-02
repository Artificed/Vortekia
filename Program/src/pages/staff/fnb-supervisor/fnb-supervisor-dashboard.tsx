import FnbSupervisorNavbar from "@/components/navbars/fnb-supervisor-navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetRestaurants } from "@/hooks/data/use-get-restaurants";
import Restaurant from "@/lib/interfaces/entities/restaurant";
import { EditRestaurantModal } from "@/components/modals/edit-restaurant-modal";
import { ViewRestaurantModal } from "@/components/modals/view-restaurant-modal";

export default function FnbSupervisorDashboard() {
  const { restaurants } = useGetRestaurants();
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredRestaurants = (restaurants || []).filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCuisine =
      cuisineFilter === "all" || restaurant.cuisineType === cuisineFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && restaurant.isOpen) ||
      (statusFilter === "closed" && !restaurant.isOpen);

    return matchesSearch && matchesCuisine && matchesStatus;
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadgeColor = (isOpen: boolean) => {
    return isOpen
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";
  };

  const handleView = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsViewMode(true);
    setIsEditMode(false);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsViewMode(false);
    setIsEditMode(true);
  };

  const resetSelection = () => {
    setSelectedRestaurant(null);
    setIsViewMode(false);
    setIsEditMode(false);
  };

  return (
    <>
      <FnbSupervisorNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="text-2xl">Restaurant Management</CardTitle>
            <CardDescription>
              Monitor and manage all food and beverage outlets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search Restaurant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    <SelectItem value="Western">Western</SelectItem>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Fast Food">Fast Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Cuisine</TableHead>
                  <TableHead>Opening Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-44">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>
                        {restaurant.cuisineType || "Not specified"}
                      </TableCell>
                      <TableCell>
                        {formatTime(restaurant.openingTime)} -{" "}
                        {formatTime(restaurant.closingTime)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadgeColor(restaurant.isOpen)}
                        >
                          {restaurant.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(restaurant)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(restaurant)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      No restaurants found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedRestaurant && (
        <>
          <ViewRestaurantModal
            restaurant={selectedRestaurant}
            isOpen={isViewMode}
            onClose={resetSelection}
            formatTime={formatTime}
            getStatusBadgeColor={getStatusBadgeColor}
          />
          <EditRestaurantModal
            restaurant={selectedRestaurant}
            isOpen={isEditMode}
            onClose={resetSelection}
          />
        </>
      )}
    </>
  );
}
