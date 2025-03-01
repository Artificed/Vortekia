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
import { useProposeRide } from "@/hooks/forms/use-propose-ride-modal";

export default function ProposeRideModal() {
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
  } = useProposeRide();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md">Propose New Ride</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Submit Ride Proposal
          </DialogTitle>
          <DialogDescription>
            Share your experience on the new ride
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="rideName">Ride Name</Label>
            <Input
              id="rideName"
              name="rideName"
              value={formData.rideName}
              onChange={(e) => handleChange("rideName", e.target.value)}
              placeholder="Enter ride name"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rideReview">Cost Review</Label>
            <Textarea
              id="rideReview"
              name="rideReview"
              value={formData.costReview}
              onChange={(e) => handleChange("costReview", e.target.value)}
              placeholder="Share your experience with this ride"
              required
              className="w-full min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Ride Image</Label>
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
