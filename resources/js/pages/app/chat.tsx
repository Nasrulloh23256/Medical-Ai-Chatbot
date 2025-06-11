// resources/js/pages/app/chat.tsx (Dengan tambahan console.log untuk debug)

import AppLayout from "@/layouts/app-layout";
import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    Bot,
    Mic,
    SendHorizontal,
    HelpCircle,
    HelpCircleIcon,
    Mail,
    Newspaper,
    FileText,
    Keyboard,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { v4 as uuidv4 } from "uuid";

type MessageType = {
    id: string;
    role: "user" | "ai";
    text: string;
    timestamp?: string;
};

export default function ChatPage() {
    const { conversationId, auth } = usePage().props as { conversationId: string; auth: any };
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const helpMenuRef = useRef<HTMLDivElement>(null);
    const user = auth.user;
    const initials = useInitials();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch messages on load & conversationId change
    useEffect(() => {
        if (!conversationId) return;
        setLoading(true);

        fetch(`/api/chat/${conversationId}/messages`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const messageMap = new Map<string, MessageType>();
                (data.messages || []).forEach((msg: any) => {
                    messageMap.set(msg.id, {
                        id: msg.id,
                        role: msg.sender === "user" ? "user" : "ai",
                        text: msg.message,
                        timestamp: msg.created_at,
                    });
                });
                setMessages(Array.from(messageMap.values()));
            })
            .catch((err) => {
                console.error("FETCH ERROR:", err);
                setMessages([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [conversationId]);

    // Help menu outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
                setIsHelpOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Send message logic
    const handleSend = async () => {
        if (!input.trim() || isResponding || !conversationId) return;

        console.log("SEND START: Mengatur isResponding menjadi true.");
        setIsResponding(true);
        const messageToSend = input;
        setInput("");

        const tempUserMessage: MessageType = {
            id: uuidv4(),
            role: "user",
            text: messageToSend,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempUserMessage]);

        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`/api/chat/${conversationId}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: messageToSend }),
            });

            const data = await res.json();
            if (!data.messages) {
                alert(data.message || "Gagal mengirim pesan (Unauthorized?)");
                return;
            }

            setMessages((prev) => {
                const messageMap = new Map<string, MessageType>();
                [
                    ...prev,
                    ...data.messages.map((msg: any) => ({
                        id: msg.id,
                        role: msg.sender === "user" ? "user" : "ai",
                        text: msg.message,
                        timestamp: msg.created_at,
                    })),
                ].forEach((msg) => messageMap.set(msg.id, msg));

                return Array.from(messageMap.values());
            });
        } catch {
            setMessages((msgs) => [
                ...msgs,
                {
                    id: uuidv4(),
                    role: "ai",
                    text: "Maaf, terjadi kesalahan.",
                    timestamp: new Date().toISOString(),
                },
            ]);
        } finally {
            setIsResponding(false);
        }
    };

    const formatTimestamp = (date: Date) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    return (
        <AppLayout>
            {/* ... Sisa JSX Anda tetap sama ... */}
            {/* (Salin sisa return statement Anda di sini) */}
            <div className="flex h-full flex-1 flex-col">
                {/* Main Chat Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
                        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
                            <h1 className="text-4xl font-bold">Medical AI Assistant</h1>
                            <p className="text-muted-foreground text-lg">
                                Selamat datang di Medical AI Assistant. Saya siap membantu Anda dengan pertanyaan
                                seputar kesehatan. Silakan mulai chat dengan saya.
                            </p>
                        </div>

                        {/* Chat Messages */}
                        <div className="mb-4 w-full max-w-3xl">
                            <div className="flex flex-col gap-2">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
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
                        <div ref={bottomRef} />

                        {/* Chat Input Section */}
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
                                        if (e.key === "Enter") handleSend();
                                    }}
                                />
                                <button
                                    disabled={isResponding}
                                    className="text-primary hover:text-primary/80 absolute right-4 p-1 transition-colors disabled:opacity-50"
                                    onClick={handleSend}
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

                {/* Help Button & Menu */}
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
