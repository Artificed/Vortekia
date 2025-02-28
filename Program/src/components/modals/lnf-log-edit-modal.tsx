import React from "react";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Camera } from "lucide-react";
import { useGetCustomers } from "@/hooks/data/use-get-customers";
import { useGetLnfStaffs } from "@/hooks/data/use-get-lnf-staffs";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import useEditLnfLog from "@/hooks/forms/use-edit-lnf-log";

interface LnfLogEditModalProps {
  formData: LnfLog;
  onCancel: () => void;
}

const LnfLogEditModal: React.FC<LnfLogEditModalProps> = ({
  formData: initialFormData,
  onCancel,
}) => {
  const { customers } = useGetCustomers();
  const { lnfStaffs } = useGetLnfStaffs();

  const {
    formData,
    loading,
    fileInputRef,
    handleChange,
    handleImageChange,
    handleImageClick,
    handleSubmit,
    loadItemForEdit,
  } = useEditLnfLog(onCancel);

  React.useEffect(() => {
    loadItemForEdit(initialFormData);
  }, [initialFormData]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex flex-col items-center">
        <div
          className="relative w-80 h-64 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={handleImageClick}
        >
          {formData.image ? (
            <img
              src={formData.image}
              alt={formData.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-4 flex flex-col items-center">
              <Camera className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {formData.image && (
          <p className="text-sm text-gray-500 mt-2">
            Click on the image to change
          </p>
        )}
      </div>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Item Type</Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastSeenLocation">Last Seen Location</Label>
          <Input
            id="lastSeenLocation"
            name="lastSeenLocation"
            value={formData.lastSeenLocation}
            onChange={(e) => handleChange("lastSeenLocation", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Missing">Missing</SelectItem>
              <SelectItem value="Found">Found</SelectItem>
              <SelectItem value="Returned To Owner">
                Returned To Owner
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="finder">Finder *</Label>
            <Select
              value={formData.finder || ""}
              onValueChange={(value) => handleChange("finder", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Finder" />
              </SelectTrigger>
              <SelectContent>
                {lnfStaffs?.map((staff) => (
                  <SelectItem key={staff.id} value={String(staff.id)}>
                    {String(staff.username)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner *</Label>
            <Select
              value={formData.owner || ""}
              onValueChange={(value) => handleChange("owner", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Owner" />
              </SelectTrigger>
              <SelectContent>
                {customers?.map((customer) => (
                  <SelectItem key={customer.id} value={String(customer.id)}>
                    {String(customer.id) + " - " + String(customer.username)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default LnfLogEditModal;
