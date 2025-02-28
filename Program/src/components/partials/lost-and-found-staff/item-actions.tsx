import { Button } from "@/components/ui/button";
import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { Edit2, Eye } from "lucide-react";

interface ItemActionsProps {
  item: LnfLog;
  onView: (item: LnfLog) => void;
  onEdit: (item: LnfLog) => void;
}

const ItemActions: React.FC<ItemActionsProps> = ({ item, onView, onEdit }) => (
  <div className="flex justify-center gap-2 w-44">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onEdit(item)}
      className="flex items-center gap-1"
    >
      <Edit2 className="h-4 w-4" />
      Edit
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onView(item)}
      className="flex items-center gap-1"
    >
      <Eye className="h-4 w-4" />
      View
    </Button>
  </div>
);

export default ItemActions;
