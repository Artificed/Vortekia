import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ToastUtils } from "@/components/utils/toast-helper";
import { invoke } from "@tauri-apps/api/core";
import { Loader2, Trash2 } from "lucide-react";
import { useGetRestaurantsWithStaffs } from "@/hooks/data/use-get-restaurants-with-staffs";
import { useGetRestaurantStaffs } from "@/hooks/data/use-get-restaurant-staffs";
import FnbSupervisorNavbar from "@/components/navbars/fnb-supervisor-navbar";

const RestaurantStaffPage: React.FC = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<string | null>(null);

  const { restaurantsWithStaffs, isLoading, isError, refetch } =
    useGetRestaurantsWithStaffs();
  const { restaurantStaffs, isRestaurantStaffsLoading } =
    useGetRestaurantStaffs();

  const handleAddStaff = async () => {
    if (!selectedRestaurantId || !selectedStaffId) {
      ToastUtils.error({
        description: "Please select a restaurant and staff member",
      });
      return;
    }

    try {
      setIsAddingStaff(true);
      await invoke("insert_new_restaurant_staff", {
        staffId: selectedStaffId,
        restaurantId: selectedRestaurantId,
      });
      ToastUtils.success({
        description: "Staff assigned successfully",
      });
      refetch();
    } catch (error) {
      ToastUtils.error({
        description: String(error),
      });
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleDeleteStaff = async (restaurantId: string, staffId: string) => {
    const compositeId = `${restaurantId}-${staffId}`;
    setDeletingSchedule(compositeId);
    try {
      await invoke("remove_restaurant_staff", { restaurantId, staffId });
      ToastUtils.success({
        description: "Staff assignment removed successfully",
      });
      refetch();
    } catch (error) {
      ToastUtils.error({
        description: String(error),
      });
    } finally {
      setDeletingSchedule(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading restaurant data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Failed to load restaurant data</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <FnbSupervisorNavbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 mt-20">
          Restaurant Staff Management
        </h1>

        <div className="space-y-10">
          {restaurantsWithStaffs && restaurantsWithStaffs.length > 0 ? (
            restaurantsWithStaffs.map((restaurantData) => {
              const waiters = restaurantData.staffs.filter(
                (staff) => staff.role.toLowerCase() === "waiter",
              );
              const chefs = restaurantData.staffs.filter(
                (staff) => staff.role.toLowerCase() === "chef",
              );
              return (
                <div
                  key={restaurantData.restaurant.id}
                  className="border-b pb-8 mb-8 last:border-b-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Restaurant info card */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>{restaurantData.restaurant.name}</CardTitle>
                        <CardDescription>
                          {restaurantData.restaurant.cuisineType} Cuisine
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span
                              className={
                                restaurantData.restaurant.isOpen === 1
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {restaurantData.restaurant.isOpen === 1
                                ? "Open"
                                : "Closed"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Hours:</span>
                            <span>
                              {restaurantData.restaurant.openingTime}-
                              {restaurantData.restaurant.closingTime}
                            </span>
                          </div>
                          <div className="mt-4">
                            {restaurantData.restaurant.image && (
                              <img
                                src={restaurantData.restaurant.image}
                                alt={restaurantData.restaurant.name}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Staff listing card */}
                    <Card className="md:col-span-3">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>
                            <h1 className="text-2xl">Staff Members</h1>
                          </CardTitle>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() =>
                                  setSelectedRestaurantId(
                                    restaurantData.restaurant.id,
                                  )
                                }
                              >
                                Add Staff
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Assign Staff to{" "}
                                  {restaurantData.restaurant.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Assign a staff member to this restaurant
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="staff" className="text-right">
                                    Staff
                                  </Label>
                                  <div className="col-span-3">
                                    <Select
                                      onValueChange={(value) => {
                                        setSelectedStaffId(value);
                                      }}
                                      value={selectedStaffId || undefined}
                                      disabled={isRestaurantStaffsLoading}
                                    >
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={
                                            isRestaurantStaffsLoading
                                              ? "Loading staff..."
                                              : "Select Staff"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {!isRestaurantStaffsLoading &&
                                        restaurantStaffs &&
                                        restaurantStaffs.length > 0 ? (
                                          restaurantStaffs.map((staff) => (
                                            <SelectItem
                                              key={staff.id}
                                              value={staff.id}
                                            >
                                              {staff.username} - {staff.role} (
                                              {staff.shiftStart
                                                .toLocaleString()
                                                .slice(0, 5)}{" "}
                                              -
                                              {staff.shiftEnd
                                                .toLocaleString()
                                                .slice(0, 5)}
                                              )
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="no-staff" disabled>
                                            {isRestaurantStaffsLoading
                                              ? "Loading staff..."
                                              : restaurantStaffs &&
                                                  restaurantStaffs.length === 0
                                                ? "No staff available"
                                                : "Please try again"}
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              <DialogFooter>
                                <Button
                                  onClick={handleAddStaff}
                                  disabled={isAddingStaff}
                                >
                                  {isAddingStaff && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Assign Staff
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {restaurantData.staffs &&
                        restaurantData.staffs.length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Waiters */}
                            <div>
                              <h3 className="text-xl font-bold mb-3">
                                Waiters
                              </h3>
                              <div className="space-y-3">
                                {waiters.length > 0 ? (
                                  waiters.map((staff) => {
                                    const compositeId = `${restaurantData.restaurant.id}-${staff.id}`;
                                    return (
                                      <div
                                        key={staff.id}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                                      >
                                        <div>
                                          <p className="font-medium text-gray-800 dark:text-gray-100">
                                            {staff.username}
                                          </p>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Working Hours:{" "}
                                            {staff.shiftStart
                                              .toLocaleString()
                                              .slice(0, 5)}
                                            {" - "}
                                            {staff.shiftEnd
                                              .toLocaleString()
                                              .slice(0, 5)}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                                          onClick={() =>
                                            handleDeleteStaff(
                                              restaurantData.restaurant.id,
                                              staff.id,
                                            )
                                          }
                                          disabled={
                                            deletingSchedule === compositeId
                                          }
                                        >
                                          {deletingSchedule === compositeId ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Trash2 className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-gray-500 italic">
                                    No waiters assigned
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Chefs */}
                            <div>
                              <h3 className="text-xl font-bold mb-3">Chefs</h3>
                              <div className="space-y-3">
                                {chefs.length > 0 ? (
                                  chefs.map((staff) => {
                                    const compositeId = `${restaurantData.restaurant.id}-${staff.id}`;
                                    return (
                                      <div
                                        key={staff.id}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                                      >
                                        <div>
                                          <p className="font-medium text-gray-800 dark:text-gray-100">
                                            {staff.username}
                                          </p>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Working Hours:{" "}
                                            {staff.shiftStart
                                              .toLocaleString()
                                              .slice(0, 5)}
                                            {" - "}
                                            {staff.shiftEnd
                                              .toLocaleString()
                                              .slice(0, 5)}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                                          onClick={() =>
                                            handleDeleteStaff(
                                              restaurantData.restaurant.id,
                                              staff.id,
                                            )
                                          }
                                          disabled={
                                            deletingSchedule === compositeId
                                          }
                                        >
                                          {deletingSchedule === compositeId ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Trash2 className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-gray-500 italic">
                                    No chefs assigned
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-center py-6">
                            No staff assigned to this restaurant
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No restaurants available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantStaffPage;
