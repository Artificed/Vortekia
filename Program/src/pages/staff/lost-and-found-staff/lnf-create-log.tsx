import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateLnfLog from "@/hooks/forms/use-create-lnf-log";
import LnfStaffNavbar from "@/components/navbars/lnf-staff-navbar";
import { useGetCustomers } from "@/hooks/data/use-get-customers";
import { useGetLnfStaffs } from "@/hooks/data/use-get-lnf-staffs";
import { useNavigate } from "react-router";
import { ToastUtils } from "@/components/utils/toast-helper";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function LnfCreatelog() {
  const { customers, isLoading: customersLoading } = useGetCustomers();
  const { lnfStaffs } = useGetLnfStaffs();
  const navigate = useNavigate();

  const {
    formData,
    loading,
    imagePreview,
    handleInputChange,
    handleStatusChange,
    handleImageChange,
    handleOwnerChange,
    handleFinderChange,
    handleSubmit,
  } = useCreateLnfLog();

  useEffect(() => {
    if (!customersLoading && customers?.length === 0) {
      ToastUtils.error({ description: "There are no customers yet!" });
    }
  }, [customers, customersLoading]);

  if (!customersLoading && customers?.length === 0) {
    return (
      <>
        <LnfStaffNavbar />
        <div className="flex flex-col justify-center min-h-screen bg-gray-100 py-24">
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Lost and Found Item Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4 text-black">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Customers Available</AlertTitle>
                <AlertDescription>
                  <p className="text-black">
                    You cannot create a lost and found log without customers in
                    the system. Please add customers first before creating a
                    log.
                  </p>
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => navigate("/customer-management")}
                className="w-full"
              >
                Back To Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (customersLoading) {
    return (
      <>
        <LnfStaffNavbar />
        <div className="flex flex-col justify-center min-h-screen bg-gray-100 py-24">
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Lost and Found Item Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading customer data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <LnfStaffNavbar />
      <div className="flex flex-col justify-center min-h-screen bg-gray-100 py-24">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Lost and Found Item Log</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Item Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Missing">Missing</SelectItem>
                    <SelectItem value="Found">Found</SelectItem>
                    <SelectItem
                      value="Returned To Owner"
                      className="opacity-50 cursor-not-allowed pointer-events-none"
                    >
                      Returned To Owner
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Item Type *</Label>
                  <Input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-lg">Missing Item Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="lastSeenLocation">Last Seen Location *</Label>
                  <Input
                    id="lastSeenLocation"
                    name="lastSeenLocation"
                    value={formData.lastSeenLocation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner *</Label>
                  <Select
                    value={formData.owner}
                    onValueChange={handleOwnerChange}
                  >
                    <SelectTrigger id="owner">
                      <SelectValue placeholder="Select Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers?.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={String(customer.id)}
                        >
                          {customer.id} - {customer.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.status === "Found" ||
                formData.status === "Returned To Owner") && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Found Item Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="image">Item Image *</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-full max-w-3xl mx-auto mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="aspect-video w-full relative bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Item preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            Image Preview:{" "}
                            {formData.name || "Lost and Found Item"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  <div className="gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="finder">Finder *</Label>
                      {lnfStaffs?.length === 0 ? (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No staff members available. You need to add staff
                            members before selecting a finder.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Select
                          value={formData.finder}
                          onValueChange={handleFinderChange}
                        >
                          <SelectTrigger id="finder">
                            <SelectValue placeholder="Select Finder" />
                          </SelectTrigger>
                          <SelectContent>
                            {lnfStaffs?.map((staff) => (
                              <SelectItem
                                key={staff.id}
                                value={String(staff.id)}
                              >
                                {staff.username}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  <div className="gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foundLocation">Found Location *</Label>
                      <Input
                        id="foundLocation"
                        name="foundLocation"
                        value={formData.foundLocation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !formData.status ||
                  loading ||
                  (formData.status === "Found" && lnfStaffs?.length === 0)
                }
              >
                {loading ? "Saving..." : "Save Item Log"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
