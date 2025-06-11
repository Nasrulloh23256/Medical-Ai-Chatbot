import { HTMLAttributes, useEffect, useState } from 'react';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Initial check based on localStorage or class on HTML element
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const isDark = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);

        // Setup observer to watch for changes in the dark class on HTML element
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    setIsDarkMode(isDark);
                }
            });
        });

        // Start observing
        observer.observe(document.documentElement, { attributes: true });

        // Listen for storage events (in case theme is changed in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme') {
                setIsDarkMode(e.newValue === 'dark');
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Use dark or light logo based on the mode
    const logoSrc = isDarkMode ? '/logo-light.png' : '/logo-dark.png';

    return (
        <div className={`w-10 h-10 ${className || ''}`} {...props}>
            <img src={logoSrc} alt="Medical AI Chatbot" className="w-full h-full object-cover" />
        </div>
    );
}
