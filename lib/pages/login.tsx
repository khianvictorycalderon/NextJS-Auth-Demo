'use client'
import { SetPageOnlyProps } from "../interfaces"
import Box from '../components/box'
import { Header, Text } from "../components/typography";
import InputLabel from "../components/input";
import { useForm, FormProvider } from "react-hook-form";

interface LoginFormValues {
  login_email: string;
  login_password: string;
}

export default function Login({ setPage }: SetPageOnlyProps) {
  const methods = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form Data:", data);
  };

  const inputFields: {
    name: keyof LoginFormValues;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
  }[] = [
    {
      name: "login_email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
    },
    {
      name: "login_password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        <Box className="text-center">
          <Header>Next.js + Supabase Auth Demo</Header>
        </Box>
        <Box>
          <Header size="large">Login</Header>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                        value="Login"
                    />
                </div>

            </form>
          </FormProvider>

          <Text className="mt-4 text-center">No account? <span className="text-blue-500 underline cursor-pointer" onClick={() => setPage("register")}>Create one</span></Text>
        </Box>
      </div>
    </div>
  );
}
