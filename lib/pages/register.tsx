'use client'
import { SetPageOnlyProps } from "../interfaces"
import Box from '../components/box'
import { Header, Text } from "../components/typography";
import InputLabel from "../components/input";
import { useForm, FormProvider } from "react-hook-form";

interface RegisterFormValues {
  first_name: string;
  last_name: string;
  birth_date: string;
  register_email: string;
  register_password: string;
  confirm_password: string;
}

export default function Register({ setPage }: SetPageOnlyProps) {
  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      register_email: "",
      register_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log("Form Data:", data);
  };

  const inputFields: {
    name: keyof RegisterFormValues;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    rules?: any;
  }[] = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "John",
      rules: { required: "First Name is required" },
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      rules: { required: "Last Name is required" },
    },
    {
      name: "birth_date",
      label: "Birth Date",
      type: "date",
      rules: { required: "Birth Date is required" },
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
        minLength: { value: 6, message: "Password must be at least 6 characters" },
      },
    },
    {
      name: "confirm_password",
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
    <div className="flex items-center justify-center">
      <div className="w-full px-4">
        <Box className="lg:w-2xl m-auto">
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
                />
              ))}

              <div className="text-center">
                <input
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                  value="Register"
                />
              </div>
            </form>
          </FormProvider>

          <Text className="mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-500 underline cursor-pointer"
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
