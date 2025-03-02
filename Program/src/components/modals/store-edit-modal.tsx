import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Store from "@/lib/interfaces/entities/store";
import { useImageUpload } from "@/hooks/forms/use-image-upload";
import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoreEditModalProps {
  formData: Store;
  onCancel: () => void;
}

export default function StoreEditModal({
  formData,
  onCancel,
}: StoreEditModalProps) {
  const [form, setForm] = useState<Store>({ ...formData });
  const {
    imagePreview,
    imageFile,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    setImagePreview,
  } = useImageUpload();

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image, setImagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedForm = { ...form };

    if (imageFile) {
      console.log("Uploading image:", imageFile);
      await new Promise((resolve) => setTimeout(resolve, 800));
      updatedForm.image = imagePreview || "";
    }

    console.log("Saving store:", updatedForm);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Store Image */}
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
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Opening Time</label>
            <Select
              value={form.openingTime}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, openingTime: value }))
              }
            >
              <SelectTrigger id="openingTime">
                <SelectValue placeholder="Select opening time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Closing Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Closing Time</label>
            <Select
              value={form.closingTime}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, closingTime: value }))
              }
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
          <Input
            id="salesAssociate"
            name="salesAssociate"
            value={form.salesAssociate || ""}
            onChange={handleChange}
            placeholder="Not Assigned"
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
            rows={4}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
