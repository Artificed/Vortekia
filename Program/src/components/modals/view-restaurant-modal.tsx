import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Restaurant from "@/lib/interfaces/entities/restaurant";

interface ViewRestaurantModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  formatTime: (time: string) => string;
  getStatusBadgeColor: (isOpen: boolean) => string;
}

export const ViewRestaurantModal = ({
  restaurant,
  isOpen,
  onClose,
  formatTime,
  getStatusBadgeColor,
}: ViewRestaurantModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restaurant Details</DialogTitle>
          <DialogDescription>
            Complete information about this restaurant
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video rounded-md overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Name</h3>
            <p>{restaurant.name}</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Cuisine Type</h3>
            <p>{restaurant.cuisineType || "Not specified"}</p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Opening Hours</h3>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {formatTime(restaurant.openingTime)} -{" "}
                {formatTime(restaurant.closingTime)}
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Status</h3>
            <Badge className={getStatusBadgeColor(restaurant.isOpen == 1)}>
              {restaurant.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
