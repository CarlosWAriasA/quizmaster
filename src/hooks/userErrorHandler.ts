import { ToastHelper } from "../utils/ToastHelper";

export function useErrorHandler() {
  const handleError = async (err: unknown) => {
    if (err instanceof Response) {
      // El backend te devolvió un Response, bien
      console.log("Handling Response error:", err);
      try {
        const errorData = await err.json();

        const message = errorData.error || "Unexpected server error";
        const type = errorData.type || "error"; // <- tipo: "warning" o "error"

        if (type === "warning") {
          ToastHelper.warning(message);
        } else {
          ToastHelper.error(message);
        }
      } catch {
        ToastHelper.error("Unexpected server error");
      }
    } else if (err instanceof Error) {
      console.log("Handling normal Error:", err);

      try {
        // ⚡ Intentar parsear si el error.message parece JSON
        const errorData = JSON.parse(err.message);

        const message = errorData.error || "Unexpected error";
        const type = errorData.type || "error";

        if (type === "warning") {
          ToastHelper.warning(message);
        } else {
          ToastHelper.error(message);
        }
      } catch {
        // Si no es JSON válido, mostrar como error normal
        ToastHelper.error(err.message);
      }
    } else {
      ToastHelper.error("Unexpected error occurred");
    }
  };

  return { handleError };
}
