import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export class ToastHelper {
  private static defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  static loading(message: string) {
    return toast.loading(message);
  }

  static error(message: string, options?: ToastOptions): void {
    toast.error(message, { ...this.defaultOptions, ...options });
  }

  static success(message: string, options?: ToastOptions): void {
    toast.success(message, { ...this.defaultOptions, ...options });
  }

  static warning(message: string, options?: ToastOptions): void {
    toast.warning(message, { ...this.defaultOptions, ...options });
  }

  static info(message: string, options?: ToastOptions): void {
    toast.info(message, { ...this.defaultOptions, ...options });
  }
}
