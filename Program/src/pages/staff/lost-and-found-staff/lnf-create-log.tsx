import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function LnfCreatelog() {
  const { customers } = useGetCustomers();

  const {
    formData,
    loading,
    handleInputChange,
    handleStatusChange,
    handleOwnerChange,
    handleSubmit,
  } = useCreateLnfLog();

  const isMissing = formData.status === "Missing";

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
                    <SelectItem
                      value="Found"
                      className="opacity-50 cursor-not-allowed pointer-events-none"
                    >
                      Found
                    </SelectItem>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Item Type *</Label>
                  <Input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
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

              {isMissing && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Missing Item Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="lastSeenLocation">
                      Last Seen Location *
                    </Label>
                    <Input
                      id="lastSeenLocation"
                      name="lastSeenLocation"
                      value={formData.lastSeenLocation}
                      onChange={handleInputChange}
                      required={isMissing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner *</Label>
                    <Select
                      value={formData.owner}
                      onValueChange={handleOwnerChange}
                    >
                      <SelectTrigger>
                        {customers?.find(
                          (customer) => String(customer.id) === formData.owner,
                        )?.username || "Select Owner"}
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={String(customer.id)}
                          >
                            {String(customer.id)} - {String(customer.username)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.status || loading}
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
