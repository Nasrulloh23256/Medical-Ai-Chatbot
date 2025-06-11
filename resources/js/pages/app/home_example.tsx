import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Mic, SendHorizontal, HelpCircle, Mail, HelpCircleIcon, Newspaper, FileText, Keyboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PageProps {
    auth: {
        user: {
            email: string;
        };
    };
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ask Any Question',
        href: '/',
    },
];

export default function Home() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const helpMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
                setIsHelpOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { auth } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col">
                {/* Main Chat Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
                        <div className="flex flex-col items-center gap-3 max-w-2xl text-center">
                            <h1 className="text-4xl font-bold">Medical AI Assistant</h1>
                            <p className="text-lg text-muted-foreground">
                                Selamat datang di Medical AI Assistant. Saya siap membantu Anda dengan pertanyaan seputar kesehatan. Silakan mulai chat dengan saya.
                            </p>
                        </div>

                        {/* Chat Input Section */}
                        <div className="w-full max-w-3xl">
                            <div className="relative flex items-center">
                                <button
                                    className="absolute left-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Voice Input"
                                >
                                    <Mic className="h-5 w-5" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Ketik pesan Anda di sini..."
                                    className="w-full rounded-2xl border bg-background px-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    className="absolute right-4 p-1 text-primary hover:text-primary/80 transition-colors"
                                    aria-label="Send Message"
                                >
                                    <SendHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-center text-muted-foreground">
                                Medical AI Assistant dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi penting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Button & Menu */}
                <div className="fixed bottom-4 right-4" ref={helpMenuRef}>
                    {isHelpOpen && (
                        <div className="absolute bottom-12 right-0 mb-2 w-64 rounded-lg border bg-background shadow-lg">
                            <div className="flex flex-col py-2">
                                <div className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                                    <Mail className="h-4 w-4" />
                                    <span>{auth?.user?.email}</span>
                                </div>
                                <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                                    <HelpCircleIcon className="h-4 w-4" />
                                    <span>Help & FAQ</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                                    <Newspaper className="h-4 w-4" />
                                    <span>Release notes</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                                    <FileText className="h-4 w-4" />
                                    <span>Terms & policies</span>
                                </button>
                                <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                                    <Keyboard className="h-4 w-4" />
                                    <span>Keyboard shortcuts</span>
                                </button>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsHelpOpen(!isHelpOpen)}
                        className="rounded-full bg-background p-2 text-muted-foreground hover:text-foreground transition-colors border shadow-sm"
                        aria-label="Help"
                    >
                        <HelpCircle className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
