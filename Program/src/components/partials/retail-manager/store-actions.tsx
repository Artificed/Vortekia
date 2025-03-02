import { Button } from "@/components/ui/button";
import Store from "@/lib/interfaces/entities/store";
import { Edit2, Eye } from "lucide-react";

interface StoreActionsProps {
  store: Store;
  onView: (store: Store) => void;
  onEdit: (store: Store) => void;
}

export default function StoreActions({
  store,
  onView,
  onEdit,
}: StoreActionsProps) {
  return (
    <div className="flex justify-center gap-2 w-44">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(store)}
        className="flex items-center gap-1"
      >
        <Edit2 className="h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(store)}
        className="flex items-center gap-1"
      >
        <Eye className="h-4 w-4" />
        View
      </Button>
    </div>
  );
}
