import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    plan: "free" | "pro";
    avatar?: string;
    email_verified_at: string | null;
    profile_photo_path: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Doctor = {
    id: number;
    name: string;
    specialization: string;
    profile_picture_url: string;
    bio: string;
    jarak: number | null;
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    mustVerifyEmail?: boolean;
    status?: string;
};
