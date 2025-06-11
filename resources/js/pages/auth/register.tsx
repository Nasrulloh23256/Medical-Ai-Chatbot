import { Head, useForm, router } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useState } from "react";
import axios from "axios"; // <-- Import axios

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, errors, setError, clearErrors } = useForm<Required<RegisterForm>>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [processing, setProcessing] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        clearErrors();

        try {
            // LANGKAH 1: Lakukan registrasi via API untuk mendapatkan token
            const response = await axios.post("/api/register", {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            // Ambil token dari respons API
            const token = response.data.access_token;
            if (!token) {
                throw new Error("Token tidak diterima dari server setelah registrasi.");
            }

            // LANGKAH 2: Simpan token dan atur header default axios
            localStorage.setItem("access_token", token);

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // LANGKAH 3: Lakukan login sesi web menggunakan Inertia
            // Ini penting untuk membuat sesi cookie dan redirect
            router.post(
                route("login"),
                { email: data.email, password: data.password }, // Gunakan email & password yg baru didaftarkan
                {
                    onError: (pageErrors) => {
                        setError("email", "Gagal membuat sesi setelah registrasi berhasil.");
                    },
                }
            );
        } catch (err: any) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key as keyof RegisterForm, backendErrors[key][0]);
                });
            } else {
                setError("email", "Terjadi kesalahan saat mendaftar.");
            }
            setProcessing(false);
        }
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{" "}
                    <TextLink href={route("login")} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
