import Store from "@/lib/interfaces/entities/store";
import { useState } from "react";

export function useSelectedStore() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsEditMode(true);
  };

  const handleView = (store: Store) => {
    setSelectedStore(store);
    setIsEditMode(false);
  };

  const resetSelection = () => {
    setSelectedStore(null);
    setIsEditMode(false);
  };

  return {
    selectedStore,
    setSelectedStore,
    isEditMode,
    setIsEditMode,
    handleEdit,
    handleView,
    resetSelection,
  };
}
