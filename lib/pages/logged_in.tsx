'use client';

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "../components/box";
import InputLabel from "../components/input";
import { Header, Text } from "../components/typography";
import { FeedbackColors, FeedbackProps, SetPageOnlyProps } from "../interfaces";
import axios from "axios";

interface AccountManagementProps {
  first_name: string;
  last_name: string;
  birth_date: string;
  new_password: string;
  confirm_new_password: string;
}

export default function LoggedIn({ setPage }: SetPageOnlyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackProps | null>({
    type: "default",
    message: ""
  });

  const methods = useForm<AccountManagementProps>({
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      new_password: "",
      confirm_new_password: ""
    }
  });

  const { handleSubmit, reset, getValues } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user", { withCredentials: true });
        reset({ ...res.data, new_password: "", confirm_new_password: "" });
      } catch (err: any) {
        console.error(err);
        setFeedback({ type: "error", message: "Failed to fetch user data. Please log in again." });
        setTimeout(() => setPage("login"), 2000);
      }
    };
    fetchUser();
  }, [reset, setPage]);

  const onSubmit = async (data: AccountManagementProps) => {
    setIsSubmitting(true);
    if (data.new_password && data.new_password !== data.confirm_new_password) {
      setFeedback({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      const { new_password, confirm_new_password, ...updates } = data;
      await axios.patch("/api/user", { ...updates, new_password }, { withCredentials: true });
      setFeedback({ type: "success", message: "Account updated successfully" });
      setIsEditing(false);
      reset({ ...updates, new_password: "", confirm_new_password: "" });
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to update account" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to permanently delete your account?")) return;
    try {
      await axios.delete("/api/user", { withCredentials: true });
      setPage("login");
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to delete account" });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setPage("login");
    } catch (err) {
      console.error(err);
      setPage("login");
    }
  };

  const fields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "birth_date", label: "Birth Date", type: "date" },
    { name: "new_password", label: "New Password", type: "password" },
    { name: "confirm_new_password", label: "Confirm New Password", type: "password" },
  ];

  return (
    <div className="flex items-center justify-center my-16 px-4 lg:max-w-4xl mx-auto">
      <Box className="w-full">
        <Header>Account Management</Header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8 max-w-4xl">
            {fields.map((field) => (
              <InputLabel
                key={field.name}
                label={field.label}
                name={field.name as keyof AccountManagementProps}
                type={field.type}
                disabled={!isEditing || isSubmitting}
              />
            ))}

            <div className="flex justify-end gap-4 mt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 cursor-pointer"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      reset({ ...getValues(), new_password: "", confirm_new_password: "" });
                      setIsEditing(false);
                    }}
                    className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer disabled:bg-blue-400 disabled:cursor-default"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </FormProvider>

        {feedback?.message && (
            <div className={`w-full py-4 rounded-md bg-neutral-800 mt-4 ${FeedbackColors[feedback.type]}`}>
                <Text className="text-center">{feedback.message}</Text>
            </div>
        )}

        <div className="text-center my-8 flex flex-col md:flex-row justify-center gap-4">
          <button
            className="bg-red-600 hover:bg-red-500 rounded-md px-6 py-2 cursor-pointer"
            onClick={handleDeleteAccount}
          >
            Permanently Delete Account
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 rounded-md px-6 py-2 cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </Box>
    </div>
  );
}
