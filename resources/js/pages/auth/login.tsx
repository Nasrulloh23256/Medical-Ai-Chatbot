import { Head, useForm, router } from "@inertiajs/react"; // Import 'router'
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useState } from "react"; // Import 'useState'
import axios from "axios";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, errors, setError, clearErrors } = useForm<Required<LoginForm>>({
        email: "",
        password: "",
        remember: false,
    });
    const [processing, setProcessing] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        clearErrors(); // Bersihkan error lama

        try {
            // LANGKAH 1: Lakukan login API terlebih dahulu
            const response = await axios.post("/api/login", {
                email: data.email,
                password: data.password,
            });

            const token = response.data.access_token;
            if (!token) {
                throw new Error("Token tidak diterima dari server.");
            }

            // LANGKAH 2: Simpan token dan pasang ke header Axios
            localStorage.setItem("access_token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // LANGKAH 3: Lakukan login sesi web menggunakan Inertia
            // Ini akan membuat sesi dan mengarahkan ke halaman /chat
            router.post(
                route("login"),
                { email: data.email, password: data.password, remember: data.remember },
                {
                    onError: (pageErrors) => {
                        // Jika login sesi gagal, tangani errornya
                        setError(pageErrors);
                    },
                }
            );
        } catch (err: any) {
            // Tangani jika login API gagal
            const message = err.response?.data?.message || "Email atau password salah.";
            setError("email", message); // Tampilkan error di bawah field email
            setProcessing(false); // Hentikan loading
        }
        // Jangan setProcessing(false) di sini karena router.post akan mengambil alih
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route("password.request")} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData("remember", !!checked)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{" "}
                    <TextLink href={route("register")} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
