'use client';
import { FeedbackColors, FeedbackProps } from "@/lib/interfaces";
import Box from '@/lib/components/box';
import { Header, Text } from '@/lib/components/typography';
import InputLabel from '@/lib/components/input';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface PasswordResetFormValues {
  new_password: string;
  confirm_password: string;
}

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Supabase sends either "access_token" or "code" in the reset link
  const token = searchParams.get('access_token') || searchParams.get('code');

  const [feedback, setFeedback] = useState<FeedbackProps | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<PasswordResetFormValues>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
    mode: 'onChange',
  });

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const inputFields: {
    name: keyof PasswordResetFormValues;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    rules?: any;
  }[] = [
    {
      name: 'new_password',
      label: 'New Password',
      type: 'password',
      placeholder: '••••••••',
      rules: {
        required: 'New Password is required',
        pattern: {
          value: passwordPattern,
          message:
            'Password must be at least 8 characters, include upper and lower case letters, a number, and a special character',
        },
      },
    },
    {
      name: 'confirm_password',
      label: 'Confirm Password',
      type: 'password',
      placeholder: '••••••••',
      rules: {
        required: 'Please confirm your password',
        validate: (value: string) =>
          value === methods.getValues('new_password') || 'Passwords do not match',
      },
    },
  ];

  const supabase = createClientComponentClient();
  const onSubmit = async (data: PasswordResetFormValues) => {
    setIsSubmitting(true);
    setFeedback({ type: 'default', message: 'Resetting password...' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) {
        setFeedback({ type: 'error', message: error.message });
        return;
      }

      setFeedback({ type: 'success', message: 'Password reset successfully! Redirecting to login...' });
      methods.reset();

      setTimeout(() => router.push('../'), 2000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-16">
      <div className="w-full px-4 lg:max-w-2xl m-auto">
        <Box>
          <Header size="large">Reset Password</Header>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                <div
                  className={`w-full py-4 rounded-md bg-neutral-800 ${FeedbackColors[feedback.type]}`}
                >
                  <Text className="text-center">{feedback.message}</Text>
                </div>
              )}

              <div className="text-center">
                <input
                  type="submit"
                  value="Reset Password"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer disabled:bg-green-300 disabled:cursor-default"
                />
              </div>
            </form>
          </FormProvider>
        </Box>
      </div>
    </div>
  );
}
