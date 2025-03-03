import { Button } from "@/components/ui/button";
import Store from "@/lib/interfaces/entities/store";
import { Edit2, Eye } from "lucide-react";
import { useNavigate } from "react-router";

interface StoreActionsProps {
  store: Store;
  onView: (store: Store) => void;
  onEdit: (store: Store) => void;
}

export default function StoreActions({ store, onEdit }: StoreActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(store)}
        className="flex items-center gap-1"
      >
        <Edit2 className="h-4 w-4" /> Edit
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/retail-manager/store/${store.id}`)}
        className="flex items-center gap-1"
      >
        <Eye className="h-4 w-4" /> View
      </Button>
    </div>
  );
}
