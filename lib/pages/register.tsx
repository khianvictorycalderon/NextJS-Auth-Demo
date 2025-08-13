'use client'
import { FeedbackColors, FeedbackProps, SetPageOnlyProps } from "../interfaces"
import Box from '../components/box'
import { Header, Text } from "../components/typography";
import InputLabel from "../components/input";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

interface RegisterFormValues {
  register_first_name: string;
  register_last_name: string;
  register_birth_date: string;
  register_email: string;
  register_password: string;
  register_confirm_password: string;
}

export default function Register({ setPage }: SetPageOnlyProps) {
  const [feedback, setFeedback] = useState<FeedbackProps | null>({
    type: "default",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      register_first_name: "",
      register_last_name: "",
      register_birth_date: "",
      register_email: "",
      register_password: "",
      register_confirm_password: "",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: RegisterFormValues) => {

    // Submitting feedback
    setIsSubmitting(true);
    setFeedback({
      type: "default",
      message: "Registering..."
    });

    try {
      const request = await axios.post("/api/auth/register", data);

      setFeedback({
        type: request.status >= 200 && request.status < 300 ? "success" : "error",
        message: request.data.error || request.data.message
      })

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setFeedback({
          type: "error",
          message: error.response.data.error || "Something went wrong. Please try again."
        });
      } else {
        setFeedback({
          type: "error",
          message: "Network error. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const namePattern = /^[A-Za-z\s'-]+$/; // Letters, spaces, apostrophes, hyphens
  const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const inputFields: {
    name: keyof RegisterFormValues;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    rules?: any;
  }[] = [
    {
      name: "register_first_name",
      label: "First Name",
      type: "text",
      placeholder: "John",
      rules: {
        required: "First Name is required",
        pattern: {
          value: namePattern,
          message: "First Name must not contain numbers or special characters",
        },
      },
    },
    {
      name: "register_last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      rules: {
        required: "Last Name is required",
        pattern: {
          value: namePattern,
          message: "Last Name must not contain numbers or special characters",
        },
      },
    },
    {
      name: "register_birth_date",
      label: "Birth Date",
      type: "date",
      rules: {
        required: "Birth Date is required",
        pattern: {
          value: birthDatePattern,
          message: "Birth date must be in YYYY-MM-DD format",
        },
        validate: (value: string) => {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return "Invalid date";
          }

          const today = new Date();
          let age = today.getFullYear() - date.getFullYear();
          const monthDiff = today.getMonth() - date.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            age--;
          }

          if (age < 18) {
            return "You must be at least 18 years old";
          }

          return true;
        },
      },
    },
    {
      name: "register_email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "register_password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      rules: {
        required: "Password is required",
        pattern: {
          value: passwordPattern,
          message:
            "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character",
        },
      },
    },
    {
      name: "register_confirm_password",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••",
      rules: {
        required: "Please confirm your password",
        validate: (value: string) =>
          value === methods.getValues("register_password") ||
          "Passwords do not match",
      },
    },
  ];


  return (
    <div className="flex items-center justify-center my-16">
      <div className="w-full px-4 lg:max-w-4xl m-auto">
        <Box>
          <Header size="large">Register</Header>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              {inputFields.map((field) => (
                <InputLabel
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  rules={field.rules}
                  disabled={isSubmitting}
                />
              ))}

              {feedback?.message && (
                <div className={`w-full py-4 rounded-md bg-neutral-800 ${FeedbackColors[feedback.type]}`}>
                  <Text className="text-center">{feedback.message}</Text>
                </div>
              )}

              <div className="text-center">
                <input
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                  value="Register"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </FormProvider>

          <Text className="mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setPage("login")}
            >
              Login
            </span>
          </Text>
        </Box>
      </div>
    </div>
  );
}
