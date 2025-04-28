import { useCallback } from "react";
import { ToastHelper } from "../utils/ToastHelper";

export function useErrorHandler() {
  const handleError = useCallback(async (err: unknown) => {
    if (err instanceof Response) {
      try {
        const errorData = await err.json();

        const message = errorData.error || "Unexpected server error";
        const type = errorData.type || "error";

        if (type === "warning") {
          ToastHelper.warning(message);
        } else {
          ToastHelper.error(message);
        }
      } catch {
        ToastHelper.error("Unexpected server error");
      }
    } else if (err instanceof Error) {
      try {
        const errorData = JSON.parse(err.message);

        const message = errorData.error || "Unexpected error";
        const type = errorData.type || "error";

        if (type === "warning") {
          ToastHelper.warning(message);
        } else {
          ToastHelper.error(message);
        }
      } catch {
        ToastHelper.error(err.message);
      }
    } else {
      ToastHelper.error("Unexpected error occurred");
    }
  }, []);

  return { handleError };
}
