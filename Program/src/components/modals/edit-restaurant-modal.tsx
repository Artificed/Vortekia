import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEditRestaurant } from "@/hooks/forms/use-edit-restaurant";
import Restaurant from "@/lib/interfaces/entities/restaurant";

interface EditRestaurantModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRestaurantModal({
  restaurant,
  isOpen,
  onClose,
}: EditRestaurantModalProps) {
  const handleClose = () => {
    onClose();
  };

  const {
    formData,
    imagePreview,
    loading,
    fileInputRef,
    handleChange,
    handleImageClick,
    handleImageChange,
    handleSubmit,
    handleDelete,
  } = useEditRestaurant(restaurant, handleClose);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Restaurant</DialogTitle>
          <DialogDescription>
            Update details for this restaurant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="restaurant-name" className="text-right">
                Name
              </Label>
              <Input
                id="restaurant-name"
                placeholder="Restaurant name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cuisine-type" className="text-right">
                Cuisine
              </Label>
              <Select
                value={formData.cuisineType}
                onValueChange={(value) => handleChange("cuisineType", value)}
              >
                <SelectTrigger className="col-span-3" id="cuisine-type">
                  <SelectValue placeholder="Select cuisine type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Western">Western</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening-time" className="text-right">
                Opening Hours
              </Label>
              <div className="col-span-3 flex gap-2 items-center">
                <Select
                  value={formData.openingTime}
                  onValueChange={(value) => handleChange("openingTime", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select opening time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 13 }, (_, i) => {
                      const hour = i + 7;
                      const time = `${hour.toString().padStart(2, "0")}:00`;
                      return (
                        <SelectItem
                          key={`open-${time}`}
                          value={time}
                          disabled={
                            !!formData.closingTime &&
                            time >= formData.closingTime
                          }
                        >
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <span className="mx-2">-</span>
                <Select
                  value={formData.closingTime}
                  onValueChange={(value) => handleChange("closingTime", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select closing time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 13 }, (_, i) => {
                      const hour = i + 7;
                      const time = `${hour.toString().padStart(2, "0")}:00`;
                      return (
                        <SelectItem
                          key={`close-${time}`}
                          value={time}
                          disabled={
                            !!formData.openingTime &&
                            time <= formData.openingTime
                          }
                        >
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.isOpen ? "open" : "closed"}
                onValueChange={(value) =>
                  handleChange("isOpen", value === "open")
                }
              >
                <SelectTrigger className="col-span-3" id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Image</Label>
              <div className="col-span-3">
                <div
                  onClick={handleImageClick}
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 h-64 flex items-center justify-center"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Click to select an image
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Restaurant
              </Button>
              <div>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
