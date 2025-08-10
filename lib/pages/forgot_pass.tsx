'use client'
import { SetPageOnlyProps } from "../interfaces";
import Box from '../components/box';
import { Header, Text } from "../components/typography";
import InputLabel from "../components/input";
import { useForm, FormProvider } from "react-hook-form";

interface ForgotPasswordFormValues {
  forgot_email: string;
}

export default function ForgotPassword({ setPage }: SetPageOnlyProps) {
  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      forgot_email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Password Reset Request:", data);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full px-4 lg:max-w-4xl m-auto">
        <Box>
          <Header size="large">Forgot Password</Header>
          <Text className="text-gray-600 mt-2">
            Enter your email address and we’ll send you instructions to reset your password.
          </Text>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <InputLabel
                name="forgot_email"
                label="Email"
                type="email"
                placeholder="you@example.com"
              />

              <div className="text-center">
                <input
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  value="Send Reset Link"
                />
              </div>
            </form>
          </FormProvider>

          <Text className="mt-4 text-center">
            Remembered your password?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setPage("login")}
            >
              Back to Login
            </span>
          </Text>
        </Box>
      </div>
    </div>
  );
}
