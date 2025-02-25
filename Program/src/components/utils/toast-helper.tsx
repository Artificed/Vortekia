import { toast, Toaster } from "sonner";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export type ToastType = "error" | "success" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const ToastProvider = () => {
  return <Toaster richColors closeButton position="bottom-right" />;
};

export const ToastUtils = {
  error: (options: ToastOptions) => {
    const { title = "Error", description, duration = 2000 } = options;

    toast.error(title || description, {
      icon: <AlertCircle className="h-4 w-4" />,
      description: title ? description : undefined,
      duration,
    });
  },

  success: (options: ToastOptions) => {
    const { title = "Success", description, duration = 2000 } = options;

    toast.success(title || description, {
      icon: <CheckCircle className="h-4 w-4" />,
      description: title ? description : undefined,
      duration,
    });
  },

  info: (options: ToastOptions) => {
    const { title = "Information", description, duration = 2000 } = options;

    toast.info(title || description, {
      icon: <Info className="h-4 w-4" />,
      description: title ? description : undefined,
      duration,
    });
  },
};
