import CooNavbar from "@/components/navbars/coo-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StaffFormData,
  useCreateStaffAccount,
} from "@/hooks/forms/use-create-staff-account";

export default function CooCreateStaff() {
  const { formData, setFormData, handleChange, handleSubmit, loading } =
    useCreateStaffAccount();

  return (
    <>
      <CooNavbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-xl">Create Staff Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <Select
              onValueChange={(value) =>
                setFormData((prev: StaffFormData) => ({ ...prev, role: value }))
              }
              value={formData.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer Service">
                  Customer Service
                </SelectItem>
                <SelectItem value="Lost and Found Staff">
                  Lost and Found Staff
                </SelectItem>
                <SelectItem value="Ride Manager">Ride Manager</SelectItem>
                <SelectItem value="Ride Staff">Ride Staff</SelectItem>
                <SelectItem value="FnB Supervisor">{`F&B Supervisor`}</SelectItem>
                <SelectItem value="Chef">Chef</SelectItem>
                <SelectItem value="Waiter">Waiter</SelectItem>
                <SelectItem value="Maintenance Manager">
                  Maintenance Manager
                </SelectItem>
                <SelectItem value="Maintenance Staff">
                  Maintenance Staff
                </SelectItem>
                <SelectItem value="Retail Manager">Retail Manager</SelectItem>
                <SelectItem value="Retail Staff">Retail Staff</SelectItem>
                <SelectItem value="Sales Associate">Sales Associate</SelectItem>
                <SelectItem value="CEO">
                  CEO (Chief Executive Officer)
                </SelectItem>
                <SelectItem value="CFO">
                  CFO (Chief Financial Officer)
                </SelectItem>
                <SelectItem value="COO">
                  COO (Chief Operating Officer)
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                const [shiftStart, shiftEnd] = value.split(" - ");
                setFormData((prev: StaffFormData) => ({
                  ...prev,
                  shiftStart,
                  shiftEnd,
                }));
              }}
              value={
                formData.shiftStart && formData.shiftEnd
                  ? `${formData.shiftStart} - ${formData.shiftEnd}`
                  : ""
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00 - 15:00">
                  Morning Shift (07:00 - 15:00)
                </SelectItem>
                <SelectItem value="09:00 - 17:00">
                  Normal Shift (09:00 - 17:00)
                </SelectItem>
                <SelectItem value="11:00 - 19:00">
                  Night Shift (11:00 - 19:00)
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
