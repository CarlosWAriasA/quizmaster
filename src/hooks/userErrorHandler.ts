import { ToastHelper } from "../utils/ToastHelper";

export function useErrorHandler() {
  const handleError = (err: unknown) => {
    const msg =
      err instanceof Error ? err.message : "Unexpected error occurred";
    ToastHelper.error(msg);
  };

  return { handleError };
}
