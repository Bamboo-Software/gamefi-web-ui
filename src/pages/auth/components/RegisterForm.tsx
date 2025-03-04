
import * as z from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/schemas/auth";
import { Checkbox } from "@/components/ui/checkbox";

type RegisterFormValues = z.infer<typeof registerSchema>;

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  terms: false

}


const RegisterForm = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const termsAccepted = form.watch("terms");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
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
                  <FormLabel className="text-gray-200">Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-transparent border-gray-600 border-2 text-gray-200"
                      placeholder="Enter your username or email"
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
                      className="bg-white text-[#E77C1B] border-2 border-[#FFB571] peer-checked:bg-[#E77C1B] peer-checked:border-transparent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                    <p className="text-sm text-gray-400">
                      You agree to our <span className="text-[#E77C1B] underline cursor:pointer">Terms of Service and Privacy Policy.</span> 
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full text-gray-200 bg-[#E77C1B] hover:bg-[#cca785] cursor-pointer border-2 my-1 h-10 text-sm border-[#FFB571] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!termsAccepted}
            >
              Create account
            </Button>
          </form>
        </Form>

      </CardContent>
    </Card>)
}

export default RegisterForm