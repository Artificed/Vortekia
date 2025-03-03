import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag } from "lucide-react";
import { useGetMenuById } from "@/hooks/data/use-get-menu-by-id";
import { useState } from "react";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
} from "../ui/dialog";

interface PurchaseModalProps {
  menuId: string;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (quantity: number) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  menuId,
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { menu } = useGetMenuById(menuId);

  if (!menu) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const totalPrice = menu.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {menu.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={menu.image}
              alt={menu.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">{menu.name}</h3>
              <p className="text-lg font-bold">${menu.price.toFixed(2)}</p>
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
            Buy Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
