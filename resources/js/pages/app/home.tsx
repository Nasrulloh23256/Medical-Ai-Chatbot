import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import {
    Bot,
    HelpCircle,
    HelpCircleIcon,
    Keyboard,
    Mail,
    Mic,
    Newspaper,
    SendHorizontal,
    User,
    FileText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import ReactMarkdown from "react-markdown";

type MessageType = {
    role: "user" | "ai";
    text: string;
    timestamp?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Ask Any Question",
        href: "/",
    },
];

export default function Home() {
    // id conversation yang aktif (otomatis dibuat di awal)
    const { auth } = usePage().props as { auth: any };
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false); // Untuk memuat history
    const [isResponding, setIsResponding] = useState(false); // State baru khusus untuk balasan AI
    const user = auth.user;
    const initials = useInitials();

    // UI help menu
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const helpMenuRef = useRef<HTMLDivElement>(null);

    // Otomatis buat conversation baru di awal masuk
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        if (conversationId === null) {
            fetch("/api/chat/history", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ title: "Percakapan " + new Date().toLocaleString() }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.conversation && data.conversation.id) {
                        setConversationId(data.conversation.id);
                    } else {
                        alert("Gagal membuat conversation.");
                    }
                });
        }
    }, [conversationId]);

    // Fetch messages jika conversationId berubah
    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }
        setLoading(true);
        fetch(`/api/chat/${conversationId}/messages`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages(
                    data.messages.map((msg: any) => ({
                        role: msg.sender === "user" ? "user" : "ai",
                        text: msg.message,
                        timestamp: msg.created_at,
                    }))
                );
            })
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    }, [conversationId]);

    // Help menu click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
                setIsHelpOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Kirim pesan ke AI (conversation aktif)
    const handleSend = async () => {
        if (!input.trim() || isResponding || !conversationId) return;

        setMessages((msgs) => [
            ...msgs,
            {
                role: "user",
                text: input,
                timestamp: new Date().toISOString(),
            },
        ]);
        const currentInput = input;
        setInput("");
        setIsResponding(true);

        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`/api/chat/${conversationId}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: currentInput }),
            });
            const data = await res.json();
            if (!data.messages) {
                alert(data.message || "Gagal mengirim pesan (Unauthorized?)");
                setIsResponding(false);
                return;
            }

            setMessages((msgs) => {
                const updated = msgs.filter((m) => m.text !== "Sedang mengetik...");
                return [
                    ...updated,
                    ...data.messages
                        .filter((msg: any) => msg.sender === "ai")
                        .map((msg: any) => ({
                            role: "ai",
                            text: msg.message,
                            timestamp: msg.created_at,
                        })),
                ];
            });
        } catch {
            setMessages((msgs) => [
                ...msgs.filter((msg) => msg.text !== "Sedang mengetik..."),
                { role: "ai", text: "Maaf, terjadi kesalahan." },
            ]);
        }
        setIsResponding(false);
    };

    const formatTimestamp = (date: Date) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col">
                <div className="flex-1 overflow-y-auto">
                    <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
                        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
                            <h1 className="text-4xl font-bold">Medical AI Assistant</h1>
                            <p className="text-muted-foreground text-lg">
                                Selamat datang di Medical AI Assistant. Saya siap membantu Anda dengan pertanyaan
                                seputar kesehatan. Silakan mulai chat dengan saya.
                            </p>
                        </div>

                        <div className="mb-4 w-full max-w-3xl">
                            <div className="flex flex-col gap-2">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "ai" && (
                                            <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                                                <Bot className="text-primary h-5 w-5" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${
                                                msg.role === "user"
                                                    ? "bg-primary text-primary-foreground dark:bg-primary/90"
                                                    : "bg-muted dark:bg-muted/50 text-foreground dark:text-foreground/90"
                                            }`}
                                        >
                                            <div className="prose prose-p:mb-2 prose-ul:mb-2 prose-li:mb-1 dark:prose-invert">
                                                <ReactMarkdown
                                                    components={{
                                                        ul: ({ children, ...props }) => (
                                                            <ul {...props} className="list-disc pl-6">
                                                                {children}
                                                            </ul>
                                                        ),
                                                        li: ({ children, ...props }) => (
                                                            <li {...props} className="mb-1">
                                                                {children}
                                                            </li>
                                                        ),
                                                        strong: ({ children, ...props }) => (
                                                            <strong {...props} className="font-bold text-primary">
                                                                {children}
                                                            </strong>
                                                        ),
                                                        img: ({ ...props }) => (
                                                            <img
                                                                {...props}
                                                                style={{
                                                                    maxWidth: 200,
                                                                    maxHeight: 200,
                                                                    borderRadius: 8,
                                                                    margin: "8px 0",
                                                                }}
                                                                className="inline-block"
                                                                alt={props.alt || "Foto dokter"}
                                                            />
                                                        ),
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-xs">
                                                {msg.timestamp ? formatTimestamp(new Date(msg.timestamp)) : ""}
                                            </p>
                                        </div>
                                        {msg.role === "user" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        user.profile_photo_path
                                                            ? `/storage/${user.profile_photo_path}`
                                                            : undefined
                                                    }
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>{initials(user.name)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {/* Tampilkan indikator "mengetik" hanya jika isResponding true */}
                                {isResponding && (
                                    <div className="flex justify-start gap-2">
                                        <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                                            <Bot className="text-primary h-5 w-5" />
                                        </div>
                                        <div className="bg-muted dark:bg-muted/50 text-foreground dark:text-foreground/90 max-w-[80%] rounded-lg p-3">
                                            <span className="text-sm">Sedang mengetik...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full max-w-3xl">
                            <div className="relative flex items-center">
                                <button
                                    className="text-muted-foreground hover:text-foreground absolute left-4 p-1 transition-colors"
                                    aria-label="Voice Input"
                                >
                                    <Mic className="h-5 w-5" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Ketik pesan Anda di sini..."
                                    className="bg-background focus:ring-primary/50 w-full rounded-2xl border px-12 py-3 focus:ring-2 focus:outline-none"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isResponding) handleSend();
                                    }}
                                    disabled={isResponding || !conversationId}
                                />
                                <button
                                    className="text-primary hover:text-primary/80 absolute right-4 p-1 transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground"
                                    aria-label="Send Message"
                                    onClick={handleSend}
                                    disabled={isResponding || !conversationId || !input.trim()}
                                >
                                    <SendHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-muted-foreground mt-2 text-center text-xs">
                                Medical AI Assistant dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi
                                penting.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="fixed right-4 bottom-4" ref={helpMenuRef}>
                    {isHelpOpen && (
                        <div className="bg-background absolute right-0 bottom-12 mb-2 w-64 rounded-lg border shadow-lg">
                            <div className="flex flex-col py-2">
                                <div className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors">
                                    <Mail className="h-4 w-4" />
                                    <span>{auth?.user?.email}</span>
                                </div>
                                <button className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors">
                                    <HelpCircleIcon className="h-4 w-4" />
                                    <span>Help & FAQ</span>
                                </button>
                                <button className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors">
                                    <Newspaper className="h-4 w-4" />
                                    <span>Release notes</span>
                                </button>
                                <button className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors">
                                    <FileText className="h-4 w-4" />
                                    <span>Terms & policies</span>
                                </button>
                                <button className="hover:bg-accent flex items-center gap-3 px-4 py-2 text-sm transition-colors">
                                    <Keyboard className="h-4 w-4" />
                                    <span>Keyboard shortcuts</span>
                                </button>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsHelpOpen(!isHelpOpen)}
                        className="bg-background text-muted-foreground hover:text-foreground rounded-full border p-2 shadow-sm transition-colors"
                        aria-label="Help"
                    >
                        <HelpCircle className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
