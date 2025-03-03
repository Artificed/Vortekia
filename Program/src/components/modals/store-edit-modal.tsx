import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Store from "@/lib/interfaces/entities/store";
import { useImageUpload } from "@/hooks/forms/use-image-upload";
import { useState, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSalesAssociates } from "@/hooks/data/use-get-sales-associates";
import { invoke } from "@tauri-apps/api/core";
import { useQueryClient } from "@tanstack/react-query";
import { ToastUtils } from "../utils/toast-helper";

interface StoreEditModalProps {
  formData: Store;
  onCancel: () => void;
}

export default function StoreEditModal({
  formData,
  onCancel,
}: StoreEditModalProps) {
  const [form, setForm] = useState<Store>({
    ...formData,
    openingTime: formData.openingTime.slice(0, 5),
    closingTime: formData.closingTime.slice(0, 5),
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

  const { salesAssociates = [] } = useGetSalesAssociates() || {};

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleOpeningTimeChange = (value: string) => {
    setForm((prev) => ({ ...prev, openingTime: value }));
  };

  const handleClosingTimeChange = (value: string) => {
    setForm((prev) => ({ ...prev, closingTime: value }));
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image, setImagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let updatedForm = { ...form };

    try {
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("update_store", {
          storeId: updatedForm.id,
          name: updatedForm.name,
          openingTime: updatedForm.openingTime + ":00",
          closingTime: updatedForm.closingTime + ":00",
          description: updatedForm.description,
          imageName: imageFile.name,
          imageBytes: bytes,
          salesAssociate: updatedForm.salesAssociate,
        });
      } else {
        await invoke("update_store", {
          storeId: updatedForm.id,
          name: updatedForm.name,
          openingTime: updatedForm.openingTime + ":00",
          closingTime: updatedForm.closingTime + ":00",
          description: updatedForm.description,
          imageName: null,
          imageBytes: null,
          salesAssociate: updatedForm.salesAssociate,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["store"] });

      ToastUtils.success({
        description: "Successfully updated store!",
      });

      onCancel();
    } catch (error) {
      ToastUtils.error({ description: String(error) });
    } finally {
      setIsSubmitting(false);
    }

    updatedForm.image = imagePreview || "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Store Image</label>
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
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Store preview"
                className="max-h-52 max-w-full rounded-md object-contain mx-auto"
              />
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center text-gray-500">
              <Upload className="h-10 w-10 mb-2" />
              <p className="font-medium">Click to upload image</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Store Name
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Opening Time</label>
            <Select
              value={form.openingTime}
              onValueChange={handleOpeningTimeChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="openingTime">
                <SelectValue placeholder="Select opening time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => {
                  const disabled = time >= form.closingTime;
                  return (
                    <SelectItem key={time} value={time} disabled={disabled}>
                      {time}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Closing Time</label>
            <Select
              value={form.closingTime}
              onValueChange={handleClosingTimeChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="closingTime">
                <SelectValue placeholder="Select closing time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => {
                  const disabled = time <= form.openingTime;
                  return (
                    <SelectItem key={time} value={time} disabled={disabled}>
                      {time}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="salesAssociate" className="text-sm font-medium">
            Sales Associate
          </label>
          <Select
            value={form.salesAssociate || ""}
            onValueChange={(value: string) =>
              setForm((prev) => ({ ...prev, salesAssociate: value }))
            }
            disabled={isSubmitting}
          >
            <SelectTrigger id="salesAssociate">
              <SelectValue placeholder="Select a sales associate" />
            </SelectTrigger>
            <SelectContent>
              {salesAssociates.map((associate) => (
                <SelectItem key={associate.id} value={associate.id}>
                  {associate.username} (
                  {associate.shiftStart.toString().slice(0, 5)}
                  {" - "}
                  {associate.shiftEnd.toString().slice(0, 5)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            rows={4}
            className="resize-none"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
      </div>
    </form>
  );
}
