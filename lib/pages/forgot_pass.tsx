'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SetPageOnlyProps, FeedbackProps, FeedbackColors } from "../interfaces";
import Box from '../components/box';
import { Header, Text } from "../components/typography";
import InputLabel from "../components/input";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";

interface ForgotPasswordFormValues {
  forgot_email: string;
}

export default function ForgotPassword({ setPage }: SetPageOnlyProps) {
  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      forgot_email: "",
    },
    mode: "onChange",
  });

  const supabase = createClientComponentClient();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackProps | null>(null);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSending(true);
    setFeedback({ type: "default", message: "Sending reset email..." });

    const { forgot_email } = data;
    const { error } = await supabase.auth.resetPasswordForEmail(forgot_email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      setFeedback({ type: "error", message: `Failed to send reset email: ${error.message}` });
    } else {
      setFeedback({ type: "success", message: "Password reset email sent! Check your inbox." });
      methods.reset();
    }

    setIsSending(false);
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
                disabled={isSending}
              />

              {feedback?.message && (
                <div
                  className={`w-full py-4 rounded-md bg-neutral-800 ${
                    FeedbackColors[feedback.type]
                  }`}
                >
                  <Text className="text-center">{feedback.message}</Text>
                </div>
              )}

              <div className="text-center">
                <input
                  type="submit"
                  className={`px-4 py-2 text-white rounded ${
                    isSending
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  }`}
                  value="Send Reset Link"
                  disabled={isSending}
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
