'use client'
import { FeedbackColors, FeedbackProps, SetPageOnlyProps } from "../interfaces"
import Box from '../components/box'
import { Header, Text } from "../components/typography";
import InputLabel from "../components/input";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

interface LoginFormValues {
  login_email: string;
  login_password: string;
}

export default function Login({ refreshSession, setPage }) {
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      login_email: "",
      login_password: ""
    },
    mode: "onChange"
  });

  const [feedback, setFeedback] = useState<FeedbackProps | null>({
    type: "default",
    message: ""
  });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setFeedback({ type: "default", message: "" });

    try {
      await axios.post("/api/auth/login", data, {
        withCredentials: true // ensure cookie is set
      });

      setTimeout(() => {
        refreshSession();
      }, 500);

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setFeedback({
          type: "error",
          message: error.response.data?.error || "Login failed"
        });
      } else {
        setFeedback({
          type: "error",
          message: "An unexpected error occurred"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields: {
    name: keyof LoginFormValues;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    rules?: any;
  }[] = [
    {
      name: "login_email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      rules: {
        required: "Email is required",
        pattern: {
          value: emailPattern,
          message: "Please enter a valid email address"
        }
      }
    },
    {
      name: "login_password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      rules: {
        required: "Password is required"
      }
    },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full px-4 lg:max-w-4xl m-auto">
        <Box className="text-center">
          <Header>Next.js + Supabase Auth Demo</Header>
        </Box>
        <Box>
          <Header size="large">Login</Header>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {inputFields.map((field) => (
                    <div key={field.name}>
                      <InputLabel
                          name={field.name}
                          label={field.label}
                          type={field.type}
                          placeholder={field.placeholder}
                          rules={field.rules}
                          disabled={isSubmitting}
                      />
                      {field.name === "login_password" && (
                          <Text className="text-sm text-blue-600 mt-2 text-right mr-8 cursor-pointer hover:underline" onClick={() => setPage("forgot_pass")}>Forgot Password</Text>
                      )}
                    </div>
                ))}
                
                {feedback?.message && (
                  <div className={`w-full py-4 rounded-md bg-neutral-800 ${FeedbackColors[feedback.type]}`}>
                    <Text className="text-center">{feedback.message}</Text>
                  </div>
                )}

                <div className="text-center">
                    <input
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer disabled:bg-blue-400 disabled:cursor-default"
                        value="Login"
                        disabled={isSubmitting}
                    />
                </div>

            </form>
          </FormProvider>

          <Text className="mt-4 text-center">No account? <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setPage("register")}>Create one</span></Text>
        </Box>
      </div>
    </div>
  );
}
