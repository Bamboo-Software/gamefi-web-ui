import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';

export const handleApiError = (error: FetchBaseQueryError | SerializedError | undefined) => {
  let errorMessage = "An unexpected error occurred";

  if (error && 'status' in error) {
    errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
  }
  else if (error && 'message' in error) {
    errorMessage = error.message || "Unknown error"; 
  }

  toast.error(errorMessage);
};
