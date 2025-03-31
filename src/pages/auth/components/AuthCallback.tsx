import routes from "@/constants/routes";
import { LoginSocialActionTypeEnum } from "@/enums/social-type.enum";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Check, X } from "lucide-react";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuthToken();
  const [message, setMessage] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");
    const action = searchParams.get("action") as LoginSocialActionTypeEnum;
    const token = searchParams.get("token");
    const errorMessage = searchParams.get("error_message");
    const errorDetails = searchParams.get("error_details");

    const handleLoginOrSync = (actionType: LoginSocialActionTypeEnum) => {
      if (actionType === LoginSocialActionTypeEnum.Login) {
        if (status === "succeeded" && token) {
          setToken(token);
          setIsSuccess(true);
          setMessage("Login Successful!");
          setDetails("You'll be redirected to the homepage shortly...");
          setTimeout(() => navigate(routes.ROOT), 5000);
        } else {
          setIsSuccess(false);
          setMessage("Login Failed");
          setDetails(errorDetails || errorMessage || "An unexpected error occurred");
          setTimeout(() => navigate(routes.AUTH), 5000);
        }
      }

      if (actionType === LoginSocialActionTypeEnum.Sync) {
        if (status === "succeeded") {
          setIsSuccess(true);
          setMessage("Social Account Linked!");
          setDetails("You'll be redirected to your profile...");
          setTimeout(() => navigate(routes.PROFILE), 5000);
        } else {
          setIsSuccess(false);
          setMessage("Linking Failed");
          setDetails(errorDetails || errorMessage || "Could not connect social account");
          setTimeout(() => navigate(routes.PROFILE), 5000);
        }
      }
    };

    if (action) {
      handleLoginOrSync(action);
    } else {
      navigate(routes.AUTH);
    }
  }, [location, navigate, setToken]);

  // Countdown effect
  useEffect(() => {
    if (isSuccess !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
        {isSuccess === null ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-4" />
            <p className="text-gray-300">Processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isSuccess ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
              }`}
            >
              {isSuccess ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-400" : "text-red-400"}`}>{message}</h2>
            <p className="text-gray-300 mb-6">{details}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
              <div
                className={`h-2.5 rounded-full ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
            </p>
            <button
              onClick={() => navigate(isSuccess ? routes.ROOT : routes.AUTH)}
              className={`mt-4 px-4 py-2 rounded-md ${
                isSuccess ? "bg-green-600 hover:bg-green-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
              } transition-colors`}
            >
              Go Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
