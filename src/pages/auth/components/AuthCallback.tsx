import routes from "@/constants/routes";
import { LoginSocialActionTypeEnum } from "@/enums/social-type.enum";
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
    const action = searchParams.get("action") as LoginSocialActionTypeEnum;
    const token = searchParams.get("token");
    const errorMessage = searchParams.get("error_message");

    const handleLoginOrSync = (actionType: LoginSocialActionTypeEnum) => {
      if (actionType === LoginSocialActionTypeEnum.Login) {
        if (status === "succeeded" && token) {
          setToken(token);
          setIsSuccess(true);
          setMessage("Login succeeded!");
          navigate(routes.ROOT);
        } else {
          setIsSuccess(false);
          setMessage(errorMessage || "Login failed!");
          navigate(routes.AUTH);
        }
      }

      if (actionType === LoginSocialActionTypeEnum.Sync) {
        if (status === "succeeded") {
          setIsSuccess(true);
          setMessage("Sync social succeeded!");
        } else {
          setIsSuccess(false);
          setMessage(errorMessage || "Sync social failed!");
        }
        navigate(routes.PROFILE);
      }
    };

    if (action) {
      handleLoginOrSync(action);
    } else {
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
