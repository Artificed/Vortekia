import type React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToastUtils } from "@/components/utils/toast-helper";
import type MaintenanceTask from "@/lib/interfaces/entities/maintenance-task";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface MaintenanceLogFormProps {
  task: MaintenanceTask;
  onSuccess: () => void;
}

export function MaintenanceLogForm({
  task,
  onSuccess,
}: MaintenanceLogFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      ToastUtils.error({
        description: "Please enter a log message",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await invoke("insert_new_maintenance_log", { taskId: task.id, message });

      ToastUtils.success({
        description: "Maintenance log submitted successfully",
      });

      setMessage("");
      onSuccess();
    } catch (error) {
      ToastUtils.error({
        description: String(error) || "Failed to submit maintenance log",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Enter your maintenance log details..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32"
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Maintenance Log"}
      </Button>
    </form>
  );
}
