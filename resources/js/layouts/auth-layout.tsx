import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <div className="relative">
            <div className="absolute right-4 top-4 z-50">
                <ThemeSwitcher className="backdrop-blur-sm bg-background/30 hover:bg-background/50 transition-colors dark:bg-background/50 dark:hover:bg-background/70 border" />
            </div>
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </div>
    );
}
