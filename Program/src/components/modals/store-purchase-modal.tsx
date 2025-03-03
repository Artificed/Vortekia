import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag } from "lucide-react";
import { useGetSouvenirById } from "@/hooks/data/use-get-souvenir-by-id";
import { useState } from "react";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
} from "../ui/dialog";

interface PurchaseModalProps {
  souvenirId: string;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (quantity: number) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  souvenirId,
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { souvenir } = useGetSouvenirById(souvenirId);

  if (!souvenir) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const totalPrice = souvenir.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {souvenir.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={souvenir.image}
              alt={souvenir.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">{souvenir.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {souvenir.description}
              </p>
              <p className="text-lg font-bold">${souvenir.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20"
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onPurchase(quantity)}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Purchase Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
