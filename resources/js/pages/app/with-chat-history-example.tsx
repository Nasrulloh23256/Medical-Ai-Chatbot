import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Bot, Mic, SendHorizontal, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Medical AI Assistant', href: '/' },
    { title: 'Chat History Example', href: '/chat/example' },
];

const mockChatConversation = [
    {
        id: '1',
        message: 'Saya mengalami sakit kepala yang berdenyut sejak tadi pagi, dan terasa semakin parah saat terkena cahaya. Apa yang harus saya lakukan?',
        sender: 'user',
        timestamp: '2024-03-20T10:00:00Z'
    },
    {
        id: '2',
        message: 'Berdasarkan gejala yang Anda jelaskan, ini bisa jadi migrain. 🤕\n\n✨ Beberapa saran untuk Anda:\n1. Istirahat di ruangan yang gelap dan tenang 🌙\n2. Hindari paparan cahaya terang dan suara bising 🔆\n3. Kompres dingin pada area yang sakit ❄️\n\n💊 Obat yang bisa diminum tanpa resep:\n• Paracetamol (500mg)\n• Ibuprofen (400mg)\n• Aspirin (500mg)\n\n👨‍⚕️ Obat dengan resep dokter:\n• Sumatriptan\n• Rizatriptan\n• Ergotamin\n• Propranolol (untuk pencegahan)\n\n⚠️ PENTING:\n• Jika dalam 24 jam tidak membaik atau malah memburuk, segera konsultasi dengan dokter\n• Jangan mengonsumsi obat resep tanpa konsultasi dokter\n• Hindari penggunaan obat berlebihan',
        sender: 'ai',
        timestamp: '2024-03-20T10:01:00Z'
    },
    {
        id: '3',
        message: 'Baik, saya akan coba istirahat dulu. Terima kasih sarannya.',
        sender: 'user',
        timestamp: '2024-03-20T10:02:00Z'
    },
    {
        id: '4',
        message: 'Senang bisa membantu, semoga Anda segera merasa lebih baik. Jika perlu, Anda bisa kembali ke sini untuk diskusi lebih lanjut.',
        sender: 'ai',
        timestamp: '2024-03-20T10:03:00Z'

    }
];

export default function WithChatHistoryExample() {
    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-4 px-2">
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-4">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold mb-2 text-foreground">Medical AI Assistant</h1>
                                <p className="text-muted-foreground">
                                    Saya adalah asisten AI yang siap membantu Anda dengan pertanyaan medis.
                                    Mohon diingat bahwa saya mungkin melakukan kesalahan dan tidak menggantikan konsultasi dengan dokter.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {mockChatConversation.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`flex gap-2 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {chat.sender === 'ai' && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${
                                                chat.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground dark:bg-primary/90'
                                                    : 'bg-muted dark:bg-muted/50 text-foreground dark:text-foreground/90'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">{chat.message}</p>
                                            <p className={`text-xs mt-1 ${
                                                chat.sender === 'user'
                                                    ? 'text-primary-foreground/80 dark:text-primary-foreground/70'
                                                    : 'text-muted-foreground dark:text-muted-foreground/70'
                                            }`}>
                                                {formatTimestamp(chat.timestamp)}
                                            </p>
                                        </div>
                                        {chat.sender === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 border-t bg-background dark:border-border/10 z-10">
                    <div className="max-w-2xl mx-auto p-4">
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
                                className="w-full rounded-2xl border bg-background dark:bg-muted/30 px-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border/10 dark:placeholder:text-muted-foreground/50"
                            />
                            <button
                                className="absolute right-4 p-1 text-primary hover:text-primary/80 transition-colors"
                                aria-label="Send Message"
                            >
                                <SendHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-center text-muted-foreground dark:text-muted-foreground/70">
                            Medical AI Assistant dapat membuat kesalahan. Pertimbangkan untuk memeriksa informasi penting.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
