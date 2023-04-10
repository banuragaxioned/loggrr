import { toast } from "react-hot-toast";

type ToastType = "success" | "error" | "warning" | "info" | "promise";

const useToast = () => {
  const showToast = (message: string, type: ToastType) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast(message);
        break;
    }
  };

  return showToast;
};

export default useToast;
