import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useImageUpload } from "@/hooks/forms/use-image-upload";
import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { ToastUtils } from "../utils/toast-helper";
import Souvenir from "@/lib/interfaces/entities/souvenir";

interface EditSouvenirModalProps {
  isOpen: boolean;
  onClose: () => void;
  souvenir: Souvenir;
  storeId: string;
}

export default function EditSouvenirModal({
  isOpen,
  onClose,
  souvenir,
  storeId,
}: EditSouvenirModalProps) {
  const [form, setForm] = useState({
    name: souvenir.name,
    price: souvenir.price,
    description: souvenir.description,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    imagePreview,
    imageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    setImagePreview,
  } = useImageUpload();

  const queryClient = useQueryClient();

  useState(() => {
    if (souvenir.image) {
      setImagePreview(souvenir.image);
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("update_souvenir", {
          souvenirId: souvenir.id,
          name: form.name,
          price: form.price,
          description: form.description,
          storeId: storeId,
          imageName: imageFile.name,
          imageBytes: bytes,
        });
      } else {
        await invoke("update_souvenir", {
          souvenirId: souvenir.id,
          name: form.name,
          price: form.price,
          description: form.description,
          storeId: storeId,
          imageName: null,
          imageBytes: null,
        });
      }

      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["store-souvenirs", storeId] });

      ToastUtils.success({
        description: "Souvenir updated successfully!",
      });

      onClose();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Souvenir</DialogTitle>
          <DialogDescription>
            Update the details for this souvenir
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Souvenir Image
            </label>
            <div
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleImageClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Souvenir preview"
                  className="max-h-40 max-w-full rounded-md object-contain mx-auto"
                />
              ) : (
                <div className="py-6 flex flex-col items-center text-gray-500">
                  <Upload className="h-8 w-8 mb-2" />
                  <p className="font-medium">Click to upload image</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price ($)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="resize-none"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
