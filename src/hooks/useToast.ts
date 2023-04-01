import { toast } from "react-toastify";

type ToastType = "success" | "error" | "warning" | "info";

const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = "success",
    options = {}
  ) => {
    toast[type](message, options);
  };

  return showToast;
};

export default useToast;
