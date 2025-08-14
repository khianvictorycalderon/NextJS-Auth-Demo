"use client";

import Link from "next/link";
import Box from "../components/box";
import { Header, Text } from "../components/typography";

export default function EmailVerified() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full px-4 lg:max-w-4xl m-auto">
        <Box className="text-center">
          <Header size="large">Email Verified 🎉</Header>
          <Text className="mt-4">
            Your account has been successfully verified. You can now log in to
            continue.
          </Text>
          <div className="mt-6">
            <Link
              href="../"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              Go to Login
            </Link>
          </div>
        </Box>
      </div>
    </div>
  );
}
