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
import { useAddMenu } from "@/hooks/forms/use-add-new-menu";
import Restaurant from "@/lib/interfaces/entities/restaurant";
import { useGetRestaurants } from "@/hooks/data/use-get-restaurants";

export function AddMenuModal() {
  const {
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
  } = useAddMenu();

  const { restaurants, isLoading } = useGetRestaurants();

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
        Add Menu Item
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add A New Menu Item</DialogTitle>
            <DialogDescription>
              Fill in the details to propose a new menu item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="menu-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="menu-name"
                  placeholder="Menu item name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="restaurant-id" className="text-right">
                  Restaurant
                </Label>
                <Select
                  value={formData.restaurantId}
                  onValueChange={(value) => handleChange("restaurantId", value)}
                >
                  <SelectTrigger className="col-span-3" id="restaurant-id">
                    <SelectValue placeholder="Select restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem disabled value="">
                        Loading...
                      </SelectItem>
                    ) : restaurants ? (
                      restaurants.map((restaurant: Restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="">
                        No restaurants available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="menu-price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="menu-price"
                  type="number"
                  placeholder="Enter price"
                  className="col-span-3"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
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
