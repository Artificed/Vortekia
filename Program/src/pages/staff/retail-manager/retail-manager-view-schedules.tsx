import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetSalesAssociateSchedules } from "@/hooks/data/use-get-sales-associate-schedules";
import RetailManagerNavbar from "@/components/navbars/retail-manager-navbar";

export default function RetailManagerViewSchedules() {
  const { salesAssociateSchedules } = useGetSalesAssociateSchedules();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const filteredStaffSchedules =
    salesAssociateSchedules?.filter((staffWithSchedule) => {
      const matchesSearch =
        staffWithSchedule.staff.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ?? false;
      const matchesSelection =
        selectedStaffId === "" ||
        selectedStaffId === "all" ||
        staffWithSchedule.staff.id.toString() === selectedStaffId;

      return matchesSearch && matchesSelection;
    }) ?? [];

  const formatTime = (timeString: string): string => {
    return timeString.substring(0, 5);
  };

  const formatShiftTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isScheduleActive = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    const startTimeInMinutes = startHours * 60 + startMinutes;
    const endTimeInMinutes = endHours * 60 + endMinutes;

    return (
      currentTimeInMinutes >= startTimeInMinutes &&
      currentTimeInMinutes <= endTimeInMinutes
    );
  };

  return (
    <>
      <RetailManagerNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Staff Schedules</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 mt-10">
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-4xl"
          />

          <Select
            onValueChange={(value) =>
              setSelectedStaffId(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select Staff Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff Members</SelectItem>{" "}
              {salesAssociateSchedules?.map((staffWithSchedule) => (
                <SelectItem
                  key={staffWithSchedule.staff.id}
                  value={staffWithSchedule.staff.id.toString()}
                >
                  {staffWithSchedule.staff.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStaffSchedules?.length ? (
            filteredStaffSchedules.map((staffWithSchedule) => (
              <Card key={staffWithSchedule.staff.id} className="shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {staffWithSchedule.staff.username}
                    </CardTitle>
                    <Badge variant="outline">
                      {staffWithSchedule.staff.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Shift Hours:{" "}
                    {formatShiftTime(
                      staffWithSchedule.staff.shiftStart.toString(),
                    )}{" "}
                    -{" "}
                    {formatShiftTime(
                      staffWithSchedule.staff.shiftEnd.toString(),
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  {staffWithSchedule.schedules.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Task</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staffWithSchedule.schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">
                              {formatTime(schedule.startTime)} -{" "}
                              {formatTime(schedule.endTime)}
                            </TableCell>
                            <TableCell>{schedule.task}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  isScheduleActive(
                                    schedule.startTime,
                                    schedule.endTime,
                                  )
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {isScheduleActive(
                                  schedule.startTime,
                                  schedule.endTime,
                                )
                                  ? "Active"
                                  : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No schedules assigned
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {searchTerm || selectedStaffId
                  ? "No staff members match your search."
                  : "No staff schedules available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
