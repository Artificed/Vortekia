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
import { useProposeRestaurant } from "@/hooks/forms/use-propose-restaurant-modal";

export function RestaurantProposalModal() {
  const {
    cuisineOptions,
    isOpen,
    setIsOpen,
    formData,
    imagePreview,
    loading,
    fileInputRef,
    handleChange,
    handleImageClick,
    handleImageChange,
    resetForm,
    handleSubmit,
  } = useProposeRestaurant();

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        className="flex items-center gap-2"
      >
        Propose Restaurant
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Propose a New Restaurant</DialogTitle>
            <DialogDescription>
              Fill in the details to propose a new restaurant for the park.
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
                    {cuisineOptions.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="opening-time" className="text-right">
                  Opens at
                </Label>
                <Select
                  value={formData.openingTime}
                  onValueChange={(value) => handleChange("openingTime", value)}
                >
                  <SelectTrigger className="col-span-3" id="opening-time">
                    <SelectValue placeholder="Select opening time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem
                        key={`open-${time}`}
                        value={time}
                        disabled={
                          !!formData.closingTime && time >= formData.closingTime
                        }
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="closing-time" className="text-right">
                  Closes at
                </Label>
                <Select
                  value={formData.closingTime}
                  onValueChange={(value) => handleChange("closingTime", value)}
                >
                  <SelectTrigger className="col-span-3" id="closing-time">
                    <SelectValue placeholder="Select closing time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem
                        key={`close-${time}`}
                        value={time}
                        disabled={
                          !!formData.openingTime && time <= formData.openingTime
                        }
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image</Label>
                <div className="col-span-3">
                  <div
                    onClick={handleImageClick}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 h-80 flex items-center justify-center"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-full"
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
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
