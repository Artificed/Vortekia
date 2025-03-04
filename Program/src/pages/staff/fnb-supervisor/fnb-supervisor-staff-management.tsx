import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";
import RestaurantWithStaffSchedule from "@/lib/interfaces/viewmodels/restaurant-with-staff-schedule";
import StaffSchedule from "@/lib/interfaces/entities/staff-schedule";
import { useGetRestaurantsWithStaffSchedules } from "@/hooks/data/use-get-restaurants-with-staff-schedules";
import { useGetRestaurantStaffs } from "@/hooks/data/use-get-restaurant-staffs";

const RestaurantStaffSchedulePage: React.FC = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [newSchedule, setNewSchedule] = useState<Omit<StaffSchedule, "id">>({
    staffId: "",
    startTime: "",
    endTime: "",
    task: "",
  });
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  const { restaurantsWithStaffSchedules, isLoading, isError, refetch } =
    useGetRestaurantsWithStaffSchedules();

  const { restaurantStaffs, isRestaurantStaffsLoading } =
    useGetRestaurantStaffs();

  const selectedRestaurant = selectedRestaurantId
    ? (restaurantsWithStaffSchedules as RestaurantWithStaffSchedule[])?.find(
        (r) => r.restaurant.id === selectedRestaurantId,
      )
    : null;

  const handleAddSchedule = async () => {
    if (!selectedRestaurantId || !selectedStaffId) {
      ToastUtils.error({
        description: "Please select a restaurant and staff member",
      });
      return;
    }

    try {
      setIsAddingSchedule(true);

      const startTimeParsed = newSchedule.startTime;
      const endTimeParsed = newSchedule.endTime;

      if (endTimeParsed <= startTimeParsed) {
        throw new Error("End time must be after start time");
      }

      await invoke("add_staff_schedule", {
        staffId: selectedStaffId,
        restaurantId: selectedRestaurantId,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
        task: newSchedule.task,
      });

      setNewSchedule({
        staffId: "",
        startTime: "",
        endTime: "",
        task: "",
      });

      ToastUtils.success({
        description: "Schedule added successfully",
      });

      refetch();
    } catch (error) {
      ToastUtils.error({
        description: String(error),
      });
    } finally {
      setIsAddingSchedule(false);
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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Restaurant Staff Scheduler</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Restaurant</CardTitle>
          <CardDescription>
            Choose a restaurant to manage staff schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) => setSelectedRestaurantId(value)}
            value={selectedRestaurantId || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Restaurant" />
            </SelectTrigger>
            <SelectContent>
              {(
                restaurantsWithStaffSchedules as RestaurantWithStaffSchedule[]
              )?.map((item) => (
                <SelectItem key={item.restaurant.id} value={item.restaurant.id}>
                  {item.restaurant.name} - {item.restaurant.cuisineType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRestaurant && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>{selectedRestaurant.restaurant.name}</CardTitle>
              <CardDescription>
                {selectedRestaurant.restaurant.cuisineType} Cuisine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={
                      selectedRestaurant.restaurant.isOpen
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {selectedRestaurant.restaurant.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hours:</span>
                  <span>
                    {selectedRestaurant.restaurant.openingTime} -
                    {selectedRestaurant.restaurant.closingTime}
                  </span>
                </div>
                <div className="mt-4">
                  {selectedRestaurant.restaurant.image && (
                    <img
                      src={selectedRestaurant.restaurant.image}
                      alt={selectedRestaurant.restaurant.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Staff Schedules</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Schedule</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Staff Schedule</DialogTitle>
                      <DialogDescription>
                        Assign a schedule to a staff member
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
                              setNewSchedule((prev) => ({
                                ...prev,
                                staffId: value,
                              }));
                            }}
                            value={selectedStaffId || undefined}
                            disabled={
                              !selectedRestaurantId || isRestaurantStaffsLoading
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedRestaurantId
                                    ? "Select a restaurant first"
                                    : isRestaurantStaffsLoading
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
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.username} - {staff.role}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-staff" disabled>
                                  {isRestaurantStaffsLoading
                                    ? "Loading staff..."
                                    : restaurantStaffs &&
                                        restaurantStaffs.length === 0
                                      ? "No staff available for this restaurant"
                                      : "Please select a restaurant first"}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startTime" className="text-right">
                          Start Time
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newSchedule.startTime}
                          onChange={(e) =>
                            setNewSchedule((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endTime" className="text-right">
                          End Time
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newSchedule.endTime}
                          onChange={(e) =>
                            setNewSchedule((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="task" className="text-right">
                          Task
                        </Label>
                        <Input
                          id="task"
                          placeholder="Enter task description"
                          value={newSchedule.task}
                          onChange={(e) =>
                            setNewSchedule((prev) => ({
                              ...prev,
                              task: e.target.value,
                            }))
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        onClick={handleAddSchedule}
                        disabled={isAddingSchedule}
                      >
                        {isAddingSchedule && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Staff</TabsTrigger>
                  {selectedRestaurant.staffWithSchedule?.map((staffItem) => (
                    <TabsTrigger
                      key={staffItem.staff.id}
                      value={staffItem.staff.id}
                    >
                      {staffItem.staff.username}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all">
                  <div className="space-y-6">
                    {selectedRestaurant.staffWithSchedule?.map((staffItem) => (
                      <div
                        key={staffItem.staff.id}
                        className="border rounded-lg p-4"
                      >
                        <h3 className="font-medium text-lg mb-2">
                          {staffItem.staff.username}
                        </h3>

                        {staffItem.schedules.length > 0 ? (
                          <div className="space-y-3">
                            {staffItem.schedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="flex justify-between bg-gray-50 p-3 rounded-md"
                              >
                                <div>
                                  <span className="font-medium">
                                    {schedule.task}
                                  </span>
                                </div>
                                <div className="text-gray-500">
                                  {schedule.startTime} - {schedule.endTime}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No schedules assigned
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {selectedRestaurant.staffWithSchedule?.map((staffItem) => (
                  <TabsContent
                    key={staffItem.staff.id}
                    value={staffItem.staff.id}
                  >
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium text-lg">
                            {staffItem.staff.username}
                          </h3>
                          <p className="text-gray-500">
                            {staffItem.staff.role || "Staff"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedStaffId(staffItem.staff.id);
                          }}
                        >
                          Add Schedule
                        </Button>
                      </div>

                      {staffItem.schedules.length > 0 ? (
                        <div className="space-y-3">
                          {staffItem.schedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex justify-between bg-gray-50 p-3 rounded-md"
                            >
                              <div>
                                <span className="font-medium">
                                  {schedule.task}
                                </span>
                              </div>
                              <div className="text-gray-500">
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No schedules assigned
                        </p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedRestaurant && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Please select a restaurant to view staff schedules
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantStaffSchedulePage;
