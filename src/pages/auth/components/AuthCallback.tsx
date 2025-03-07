import routes from "@/constants/routes";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuthToken();
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");
    const action = searchParams.get("action");
    const token = searchParams.get("token");
    const errorMessage = searchParams.get("error_message");

    if (status === "succeeded" && action === "login" && token) {
      setToken(token);
      setIsSuccess(true);
      setMessage("Login succeeded!");
      navigate(routes.ROOT);
    } else if (status === "failed") {
      setIsSuccess(false);
      setMessage(errorMessage || "Login failed!");
      navigate(routes.AUTH);
    }
  }, [location, navigate, setToken]);

  useEffect(() => {
    if (isSuccess !== null) {
      if (isSuccess) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, [isSuccess, message]);

  return <></>;
};

export default AuthCallback;
