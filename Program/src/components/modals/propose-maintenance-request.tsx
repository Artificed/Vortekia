import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastUtils } from "@/components/utils/toast-helper";
import type MaintenanceRequest from "@/lib/interfaces/entities/maintenance-request";
import { invoke } from "@tauri-apps/api/core";

interface MaintenanceRequestModalProps {
  onSuccess?: (request: MaintenanceRequest) => void;
  buttonLabel?: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function MaintenanceRequestModal({
  buttonLabel = "Submit Maintenance Request",
  buttonVariant = "default",
}: MaintenanceRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      ToastUtils.error({
        description: "Please enter a title for your request",
      });
      return;
    }

    if (!formData.content.trim()) {
      ToastUtils.error({
        description: "Please enter details for your request",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await invoke("insert_new_maintenance_request", {
        title: formData.title,
        content: formData.content,
      });

      ToastUtils.success({
        description: "Maintenance request submitted successfully",
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      ToastUtils.error({
        description: String(error) || "Failed to submit maintenance request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Maintenance Request</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit a new maintenance request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Details</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Provide detailed information about the maintenance issue"
              value={formData.content}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="min-h-32"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
