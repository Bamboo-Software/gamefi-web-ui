import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {useNavigate} from "react-router-dom"
import { useRegisterMutation, useVerifyAccountMutation, useResendAccountActivationMutation } from "@/services/auth";
import routes from "@/constants/routes";
import { registerSchema, otpSchema } from "@/schemas/auth";

const {ROOT} = routes;

type RegisterFormValues = z.infer<typeof registerSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const defaultValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  terms: false,
};

const RegisterForm = () => {
  const navigate = useNavigate();
  // RTK Query mutations
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [verifyAccount, { isLoading: isVerifyLoading }] = useVerifyAccountMutation();
  const [resendAccountActivation, { isLoading: isResendLoading}] = useResendAccountActivationMutation();

  // Registration form setup
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  // OTP form setup
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const termsAccepted = form.watch("terms");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Handle registration submission
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const formData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
      const response = await register(formData).unwrap();
      if (response.success) {
        setToken(response.data.token);
        setShowOtpDialog(true);

        toast.success("Please check your email for the verification code.");
      } else {
        throw new Error("Registration failed");
      }

    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again -" + error.data.message[0].error);
    }
  };

  // Handle OTP submission
  const onOtpSubmit = async (data: OtpFormValues) => {
    try {
      if (!token) throw new Error("Token not found");
      const response = await verifyAccount({ token, code: data.otp }).unwrap();
      if (response.success) {
        toast.success("Account verified successfully!");
        setShowOtpDialog(false);
        form.reset(); // Reset registration form
        navigate(ROOT)
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed. Please try again.");
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      const email = form.getValues("email");
      await resendAccountActivation({ email }).unwrap();
      toast.success("OTP has been resent to your email.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      {/* Registration Form */}
      <Card className="border-none bg-[#222936]">
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex w-full *:w-full flex-1 gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="bg-transparent border-gray-600 border-2 text-gray-200"
                          placeholder="Enter your first name"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="bg-transparent border-gray-600 border-2 text-gray-200"
                          placeholder="Enter your last name"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="bg-transparent border-gray-600 border-2 text-gray-200"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-transparent border-gray-600 border-2 text-gray-200"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="items-top flex space-x-2">
                    <FormControl>
                      <Checkbox
                        id="terms1"
                        className="bg-white text-[#E77C1B] border-2 border-[#FFB571]"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none text-gray-200"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-sm text-gray-400">
                        You agree to our{" "}
                        <span className="text-[#E77C1B] underline cursor-pointer">
                          Terms of Service and Privacy Policy.
                        </span>
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-gray-200 bg-[#E77C1B] hover:bg-[#cca785] border-2 my-1 h-10 text-sm border-[#FFB571] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!termsAccepted || isRegisterLoading}
              >
                {isRegisterLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
              <DialogDescription>
                Please enter the 6-digit OTP sent to your email.
              </DialogDescription>
            </DialogHeader>
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          maxLength={6}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                          className="bg-transparent border-gray-600 border-2 text-gray-200"
                          placeholder="Enter 6-digit OTP"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full text-gray-200 bg-[#E77C1B] hover:bg-[#cca785] border-2 border-[#FFB571]"
                  disabled={isVerifyLoading}
                >
                  {isVerifyLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  onClick={handleResendOtp}
                  className="w-full text-gray-200 bg-transparent border-2 border-[#FFB571] hover:bg-[#cca785]"
                  disabled={isResendLoading}
                >
                  {isResendLoading ? "Resending..." : "Resend OTP"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RegisterForm;