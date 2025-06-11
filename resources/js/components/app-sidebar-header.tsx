import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { type BreadcrumbItem as BreadcrumbItemType, PageProps } from "@/types";
import { Sparkles, Sun, Moon, MoreVertical, Settings } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    // 1. Mengambil data user dari page props
    const {
        props: { auth },
    } = usePage<PageProps>();
    const isPro = auth.user.plan === "pro";

    const [theme, setTheme] = useState<"light" | "dark">("light");
    const isMobile = useIsMobile();

    useEffect(() => {
        // Get initial theme from localStorage or system preference
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = savedTheme || systemTheme;

        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const DesktopActions = () => (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                <div className="relative">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute left-0 top-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
                <span className="sr-only">Toggle theme</span>
            </Button>

            <Link href={route("profile.edit")} title="User Settings">
                <Button variant="ghost" size="icon" className="mr-2">
                    <Settings className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">User Settings</span>
                </Button>
            </Link>

            <Link
                href="/upgrade-plan"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
                <Sparkles className="h-4 w-4" />
                {/* 2. Mengubah teks tombol secara kondisional */}
                {isPro ? "Lihat Plan" : "Upgrade Plan"}
            </Link>
        </>
    );

    const MobileDropdown = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleTheme}>
                    <div className="relative mr-2">
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute left-0 top-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route("profile.edit")} className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/upgrade-plan" className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        {/* 3. Mengubah teks menu dropdown secara kondisional */}
                        {isPro ? "Lihat Plan" : "Upgrade Plan"}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <header className="sticky top-0 z-30 border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 rounded-t-lg border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 bg-background">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center">{isMobile ? <MobileDropdown /> : <DesktopActions />}</div>
        </header>
    );
}
