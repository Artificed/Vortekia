import LnfLog from "@/lib/interfaces/entities/lnf-log";
import { useState } from "react";

export function useSelectedLnfItem() {
  const [selectedItem, setSelectedItem] = useState<LnfLog | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleEdit = (item: LnfLog) => {
    setSelectedItem(item);
    setIsEditMode(true);
  };

  const handleView = (item: LnfLog) => {
    setSelectedItem(item);
    setIsEditMode(false);
  };

  const resetSelection = () => {
    setSelectedItem(null);
    setIsEditMode(false);
  };

  return {
    selectedItem,
    setSelectedItem,
    isEditMode,
    setIsEditMode,
    handleEdit,
    handleView,
    resetSelection,
  };
}
