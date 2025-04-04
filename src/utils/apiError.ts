import { ApiErrorResponse } from "@/interfaces/IApiResponse";
import { toast } from "sonner";

export const handleError = (error: unknown): string => {
  const errorMessage = (error as ApiErrorResponse).data?.message;

  let displayMessage: string;

  if (Array.isArray(errorMessage)) {
    displayMessage = errorMessage[0].error || "Something went wrong";
  } else {
    displayMessage = errorMessage || "Something went wrong";
  }

  toast.error(displayMessage);
  return displayMessage;
};
