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

export default function LnfCreatelog() {
  const {
    formData,
    loading,
    imagePreview,
    handleInputChange,
    handleStatusChange,
    handleImageChange,
    handleSubmit,
  } = useCreateLnfLog();

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
                    {["Found", "Returned to Owner"].map((value) => (
                      <SelectItem
                        key={value}
                        value={value}
                        aria-disabled={true}
                        className="opacity-50 cursor-not-allowed pointer-events-none"
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemType">Item Type *</Label>
                  <Input
                    id="itemType"
                    name="itemType"
                    value={formData.itemType}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemColor">Color</Label>
                  <Input
                    id="itemColor"
                    name="itemColor"
                    value={formData.itemColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-lg">Found Item Details</h3>

                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
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
                          {formData.itemName || "Lost and Found Item"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="finder">Finder Information *</Label>
                  <Input
                    id="finder"
                    name="finder"
                    value={formData.finder}
                    onChange={handleInputChange}
                    placeholder="Name, contact info, or employee ID"
                    required
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner">Owner Information *</Label>
                  <Input
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    placeholder="Name, contact info"
                    required
                  />
                </div>
              </div>
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
