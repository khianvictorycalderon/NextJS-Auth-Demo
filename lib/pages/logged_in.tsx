'use client';

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "../components/box";
import InputLabel from "../components/input";
import { Header } from "../components/typography";
import { SetPageOnlyProps } from "../interfaces";
import axios from "axios";

interface AccountManagementProps {
    logged_first_name: string;
    logged_last_name: string;
    logged_birth_date: string;
    logged_new_password: string;
    logged_confirm_new_password: string;
}

export default function LoggedIn({ setPage }: SetPageOnlyProps) {
    // Simulated user data from server
    const initialData: AccountManagementProps = {
        logged_first_name: "",
        logged_last_name: "",
        logged_birth_date: "",
        logged_new_password: "",
        logged_confirm_new_password: ""
    };

    const [isEditing, setIsEditing] = useState(false);

    const methods = useForm<AccountManagementProps>({
        defaultValues: initialData
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
    const fetchUser = async () => {
        try {
        const res = await axios.get('/api/user', { withCredentials: true });
        if (res.data.user) {
            reset({
            logged_first_name: res.data.user.first_name,
            logged_last_name: res.data.user.last_name,
            logged_birth_date: res.data.user.birth_date,
            logged_new_password: '',
            logged_confirm_new_password: '',
            });
        }
        } catch (err) {
        console.error('Failed to fetch user:', err);
        }
    };

    fetchUser();
    }, [reset]);

    const onSubmit = async (data: AccountManagementProps) => {
        if (data.logged_new_password !== data.logged_confirm_new_password) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.patch('/api/user', {
            first_name: data.logged_first_name,
            last_name: data.logged_last_name,
            birth_date: data.logged_birth_date,
            new_password: data.logged_new_password || undefined,
            }, { withCredentials: true });

            alert(res.data.message);
            setIsEditing(false);
            reset({
                logged_first_name: res.data.user.user_metadata.first_name,
                logged_last_name: res.data.user.user_metadata.last_name,
                logged_birth_date: res.data.user.user_metadata.birth_date,
                logged_new_password: '',
                logged_confirm_new_password: '',
            });
        } catch (err: any) {
            alert(err.response?.data?.error || 'Update failed');
        }
        };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to permanently delete your account?')) return;

        try {
            await axios.delete('/api/user/[id]', { withCredentials: true });
            alert('Account deleted. Logging out...');
            setPage('login');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Delete failed');
        }
    };

    const handleCancel = () => {
        reset(initialData); // revert form values
        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
            setPage("login");
        } catch (err) {
            console.error("Logout failed:", err);
            setPage("login");
        }
    };

    const fields = [
        { name: "logged_first_name", label: "First Name", type: "text" },
        { name: "logged_last_name", label: "Last Name", type: "text" },
        { name: "logged_birth_date", label: "Birth Date", type: "date" },
        { name: "logged_new_password", label: "New Password", type: "password" },
        { name: "logged_confirm_new_password", label: "Confirm New Password", type: "password" },
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
                                disabled={!isEditing} // Disable inputs when not editing
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
                                        onClick={handleCancel}
                                        className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </FormProvider>
                
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
