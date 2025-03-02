import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProposeNewStore } from "@/hooks/forms/use-propose-new-store";

export default function ProposeNewStoreModal() {
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
  } = useProposeNewStore();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md">Propose New Store</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Submit New Store Proposal
          </DialogTitle>
          <DialogDescription>
            Insert description for new store
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={(e) => handleChange("storeName", e.target.value)}
              placeholder="Enter store name"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter a brief description regarding the new store"
              required
              className="w-full min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Explain why the new store has potential"
              required
              className="w-full min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Store Image (Concept)</Label>
            <div
              className="relative w-full h-56 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Ride preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4 flex flex-col items-center">
                  <Camera className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload an image
                  </p>
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

            {imagePreview && (
              <p className="text-sm text-gray-500 mt-2">
                Click on the image to change
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
