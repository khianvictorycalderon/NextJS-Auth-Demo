'use client'
import { LoginProps } from "../interfaces"
import Box from '../components/box'
import { Header } from "../components/typography";

export default function Login({
    setPage
}: LoginProps) {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div>
                <Box className="!p-4">
                    <Header>Next.js Auth Demo</Header>
                </Box>
                <Box>
                    <Header size="large">Login</Header>
                </Box>
            </div>
        </div>
    );
}