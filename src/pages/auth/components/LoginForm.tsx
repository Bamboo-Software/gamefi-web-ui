import google from "@/assets/icons/google.svg";
import x from "@/assets/icons/x.svg";
import facebook from "@/assets/icons/socials/fb_icon.svg";
import instagram from "@/assets/icons/socials/ig_icon.svg";
// import metamask from "@/assets/icons/metamask.svg";
// import phantom from "@/assets/icons/phantom.svg";
import wallets from "@/assets/images/profile/wallet.svg"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth";
import { z } from "zod";
import { ForgotPasswordDialog } from "./ForgotPassword";
import { useLoginMutation } from "@/services/auth";
import routes from "@/constants/routes";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/spinner";
import { useAuthToken } from "@/hooks/useAuthToken";
import { LoginSocialActionTypeEnum, SocialTypeEnum } from "@/enums/social-type.enum";
import ConnectWallet from "@/pages/wallet/components/ConnectWallet";
import ConnectWalletDialog from "./ConnectWalletDialog";
import { siteURL } from "@/configs/config";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const { ROOT } = routes;
const loginTypes = [
    {
        key: SocialTypeEnum.Google,
        name: "Google",
        icon: google,
        type: "social",
    },
    {
        key: SocialTypeEnum.X,
        name: "X",
        icon: x,
        type: "social",
    },
    {
        key: SocialTypeEnum.Facebook,
        name: "Facebook",
        icon: facebook,
        type: "social",
    },
    {
        key: SocialTypeEnum.Instagram,
        name: "Instagram",
        icon: instagram,
        type: "social",
    },
    //   {
    //     key: SocialTypeEnum.Metamask,
    //     name: "Metamask",
    //     icon: metamask,
    //     type: "wallet",
    //   },
    //   {
    //     key: SocialTypeEnum.Phantom,
    //     name: "Phantom",
    //     icon: phantom,
    //     type: "wallet",
    //   },
];

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultLoginFormValues = {
    email: "",
    password: "",
}
const LoginForm = () => {
    const { setToken } = useAuthToken()
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading: isLoginLoading }] = useLoginMutation()
    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: defaultLoginFormValues
    });
    const searchParams = new URLSearchParams(location.search);

    const onLoginSubmit = async (data: LoginFormValues) => {
        try {
            const response = await login(data).unwrap();
            if (response && response.data.token) {
                setToken(response.data.token);
                window.location.href = ROOT; 
                // navigate(ROOT);
            } else {
                toast.error("Login Failed!");
            }

            // if(response.data.statusCode == 400){
            //     toast.error("Login Failed!");

            // }
        } catch (error) {
            console.error(error);
            toast.error("Login Failed! Please check your Email or Password!");
        }
    };

    const redirectToLoginSocial = (provider: SocialTypeEnum) => {
        const appUrl = window.location.origin;
        const ref = searchParams.get("ref");

        const params = new URLSearchParams({
            state: `${appUrl}${routes.AUTH_CALLBACK}`,
            ...(ref ? { ref } : {}),
            action: LoginSocialActionTypeEnum.Login,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        window.location.href = `${siteURL}/api/auth/login/${provider}?${params.toString()}`;
    };

    const handleSocialLogin = async (provider: SocialTypeEnum) => {
        redirectToLoginSocial(provider)
    };

    const handleWalletLogin = async (wallet: string) => {
        try {
            console.log(`Connecting to ${wallet}`);
            // Add your wallet connection logic here
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Card className="border-none bg-[#222936]">
            <CardContent className="space-y-4">
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            className="bg-transparent border-gray-600 border-2 text-gray-200"
                                            placeholder="Enter your username or email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
<FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="text-gray-200 flex flex-row justify-between">
                                            <span>Password</span>
                                            <ForgotPasswordDialog />
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    className="bg-transparent border-gray-600 border-2 text-gray-200 pr-10"
                                                    placeholder="Enter your password"
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <Button type="submit" className="w-full text-gray-200 bg-[#E77C1B] hover:bg-[#cca785] cursor-pointer border-2 h-10 text-sm border-[#FFB571]">
                            {isLoginLoading ? <LoadingSpinner /> : "Sign In"}
                        </Button>
                    </form>
                </Form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-[#222936] px-2 text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {loginTypes.map((loginType) => (
                        <Button
                            key={loginType.key}
                            variant="outline"
                            className="border-gray-600 bg-[#222936] text-gray-200 cursor-pointer"
                            onClick={() => loginType.type == "social" ? handleSocialLogin(loginType.key) : handleWalletLogin(loginType.key)}
                        >
                            <img className="size-6" src={loginType.icon} alt={loginType.name} srcSet="" />
                            {loginType.name}
                        </Button>
                    ))}
                </div>
                <div className="flex justify-center">
                    <ConnectWalletDialog trigger={
                        <Button
                            variant="outline"
                            className="border-gray-600 flex-row justify-center items-center bg-[#222936] text-gray-200 cursor-pointer w-full"
                        >
                            <img className="size-5 mr-2" src={wallets} alt={"login wallet"} srcSet="" />
                            <span>Connect to wallets</span>
                        </Button>
                    }>
                        <ConnectWallet />
                    </ConnectWalletDialog>
                </div>
            </CardContent>
        </Card>)
}

export default LoginForm