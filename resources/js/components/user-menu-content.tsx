import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { type User } from "@/types";
import { Link, router } from "@inertiajs/react";
import { LogOut, Settings } from "lucide-react";
import axios from "axios";

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    // --- PERBAIKI FUNGSI INI ---
    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        try {
            // 1. Panggil API logout terlebih dahulu untuk menghapus token di DB
            await axios.post("/api/logout");
        } catch (error) {
            console.error("Failed to logout from API, but proceeding with client-side logout.", error);
        } finally {
            // 2. Selalu jalankan pembersihan di sisi client, apa pun yang terjadi
            localStorage.removeItem("access_token");
            delete axios.defaults.headers.common["Authorization"];
            cleanup();

            // 3. Lakukan logout sesi web seperti biasa
            router.post(route("logout"));
        }
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route("profile.edit")} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route("logout")} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
