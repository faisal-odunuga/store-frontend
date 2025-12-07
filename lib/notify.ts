import { toast } from 'sonner';

export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      className: 'bg-green-500 text-white border-none', // Optional styling for "premium" feel if default isn't enough
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      className: 'bg-red-500 text-white border-none',
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
};
