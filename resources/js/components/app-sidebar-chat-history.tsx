import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, usePage } from "@inertiajs/react";
import { type PageProps } from "@/types";
import { Building2, MessageSquare, Plus, Search, ShoppingBag, Stethoscope } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import AppLogo from "./app-logo";
import HospitalsPopup from "./hospitals";
import { NearbyDoctorsList } from "./doctors-nearby-list";

interface ChatHistory {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    group: string;
}

interface AppSidebarChatHistoryProps {
    chatHistories: ChatHistory[];
    activeChatId?: string;
}

export function AppSidebarChatHistory({ chatHistories, activeChatId }: AppSidebarChatHistoryProps) {
    // Mengambil data user dan menentukan status plan "Pro"
    const { auth } = usePage<PageProps>().props;
    const isPro = auth.user.plan === "pro";

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [filteredAndGroupedChats, setFilteredAndGroupedChats] = useState<Record<string, ChatHistory[]>>({});
    const [showHospitals, setShowHospitals] = useState(false);

    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            const filtered = chatHistories
                .filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .reduce(
                    (groups, chat) => {
                        const group = chat.group;
                        if (!groups[group]) {
                            groups[group] = [];
                        }
                        groups[group].push(chat);
                        return groups;
                    },
                    {} as Record<string, ChatHistory[]>
                );

            setFilteredAndGroupedChats(filtered);
            setIsSearching(false);
        }, 300); // Mengurangi delay untuk pencarian yang lebih responsif

        return () => clearTimeout(timer);
    }, [searchQuery, chatHistories]);

    const renderSkeletons = () => (
        <>
            <div className="mb-4 space-y-0.5">
                <Skeleton className="mb-2 h-4 w-20" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            <div className="mb-4 space-y-0.5">
                <Skeleton className="mb-2 h-4 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </>
    );

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <Sidebar collapsible="icon" variant="inset" className="w-64">
            <SidebarHeader className="pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/chat" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="bg-sidebar sticky top-0 z-20 pb-2">
                    <div className="mb-2 px-2">
                        <div className="border-border/50 bg-muted/30 overflow-hidden rounded-lg border">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        disabled={!isPro}
                                        className="hover:bg-accent/50 border-border/50 flex w-full items-center gap-3 border-b px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <div className="bg-primary/10 rounded-md p-1.5">
                                            <Stethoscope className="text-primary h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="font-medium">Konsultasi Dokter</span>

                                            {/* Label "Pro" akan muncul di bawah jika !isPro */}
                                            {!isPro && (
                                                <span className="block text-xs font-semibold text-muted-foreground">
                                                    (Hanya untuk Pro)
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </DialogTrigger>
                                {isPro && (
                                    <DialogContent className="max-w-md mx-auto">
                                        <DialogHeader>
                                            <DialogTitle>Dokter di Sekitar Anda</DialogTitle>
                                            <DialogDescription>
                                                Berikut adalah daftar dokter yang tersedia untuk konsultasi.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <NearbyDoctorsList />
                                        </div>
                                    </DialogContent>
                                )}
                            </Dialog>
                            {/* --- Akhir Implementasi --- */}

                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowHospitals(true);
                                }}
                                className="hover:bg-accent/50 border-border/50 flex items-center gap-3 border-b px-3 py-2 text-sm transition-colors"
                            >
                                <div className="rounded-md bg-blue-500/10 p-1.5">
                                    <Building2 className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="font-medium">Rumah Sakit Terdekat</span>
                            </Link>
                            <HospitalsPopup open={showHospitals} onClose={() => setShowHospitals(false)} />
                            <Link
                                href="/upgrade-plan"
                                className="hover:bg-accent/50 flex items-center gap-3 px-3 py-2 text-sm transition-colors"
                            >
                                <div className="rounded-md bg-green-500/10 p-1.5">
                                    <ShoppingBag className="h-4 w-4 text-green-500" />
                                </div>
                                <span className="font-medium">Shop</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mb-2 px-2">
                        <Link
                            href="/chat"
                            className="border-input hover:bg-accent flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Chat Baru</span>
                        </Link>
                    </div>
                    <div className="mb-2 px-2">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari chat..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="bg-muted/30 border-input w-full rounded-md border py-1.5 pr-3 pl-8 text-sm outline-none focus:ring-0 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-2 px-2">
                    <div className="flex flex-col gap-2 px-2">
                        {isSearching
                            ? renderSkeletons()
                            : Object.entries(filteredAndGroupedChats).map(([group, chats]) => (
                                  <div key={group} className="mb-4 space-y-0.5">
                                      <h3 className="text-muted-foreground mb-1 px-2 text-xs font-medium">{group}</h3>
                                      {chats.map((chat) => (
                                          <div key={chat.id} className="group/item">
                                              <div className="hover:bg-accent relative flex items-center rounded-lg">
                                                  <Link
                                                      href={`/chat/${chat.id}`}
                                                      className={`flex flex-1 items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                                          activeChatId === chat.id ? "bg-accent" : ""
                                                      }`}
                                                  >
                                                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                                                      <div className="min-w-0 flex-1">
                                                          <span className="block truncate transition-all group-hover/item:max-w-[80%]">
                                                              {chat.title}
                                                          </span>
                                                      </div>
                                                  </Link>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              ))}
                    </div>
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
