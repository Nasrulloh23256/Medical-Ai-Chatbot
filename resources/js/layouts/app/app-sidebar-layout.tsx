import { AppContent } from "@/components/app-content";
import { AppShell } from "@/components/app-shell";
import { AppSidebarChatHistory } from "@/components/app-sidebar-chat-history";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { type BreadcrumbItem } from "@/types";
import axios from "axios";
import { useEffect, useState, type PropsWithChildren } from "react";

// const mockChatHistories = [
//     // Today
//     {
//         id: "1",
//         title: "Konsultasi Gejala Demam",
//         lastMessage: "Bagaimana cara mengatasi demam tinggi?",
//         timestamp: "2024-03-20 14:30",
//         group: "Today"
//     },
//     {
//         id: "2",
//         title: "Konsultasi Alergi Makanan",
//         lastMessage: "Gejala alergi kacang",
//         timestamp: "2024-03-20 10:15",
//         group: "Today"
//     },
//     // Yesterday
//     {
//         id: "3",
//         title: "Masalah Tekanan Darah",
//         lastMessage: "Cara mengontrol tekanan darah tinggi",
//         timestamp: "2024-03-19 16:45",
//         group: "Yesterday"
//     },
//     {
//         id: "4",
//         title: "Konsultasi Asam Lambung",
//         lastMessage: "Makanan untuk GERD",
//         timestamp: "2024-03-19 09:30",
//         group: "Yesterday"
//     },
//     // Previous 7 Days
//     {
//         id: "5",
//         title: "Konsultasi Nutrisi Anak",
//         lastMessage: "Menu sehat untuk balita",
//         timestamp: "2024-03-18 11:20",
//         group: "Previous 7 Days"
//     },
//     {
//         id: "6",
//         title: "Masalah Insomnia",
//         lastMessage: "Tips mengatasi susah tidur",
//         timestamp: "2024-03-17 20:15",
//         group: "Previous 7 Days"
//     },
//     {
//         id: "7",
//         title: "Konsultasi Kolesterol",
//         lastMessage: "Cara menurunkan kolesterol",
//         timestamp: "2024-03-16 13:45",
//         group: "Previous 7 Days"
//     },
//     {
//         id: "8",
//         title: "Masalah Migrain",
//         lastMessage: "Pencegahan sakit kepala",
//         timestamp: "2024-03-15 15:30",
//         group: "Previous 7 Days"
//     },
//     // Previous 30 Days
//     {
//         id: "9",
//         title: "Konsultasi Diabetes",
//         lastMessage: "Pengaturan gula darah",
//         timestamp: "2024-03-10 09:15",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "10",
//         title: "Masalah Pencernaan",
//         lastMessage: "Tips melancarkan pencernaan",
//         timestamp: "2024-03-08 14:20",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "11",
//         title: "Konsultasi Alergi Kulit",
//         lastMessage: "Penanganan eksim",
//         timestamp: "2024-03-05 16:30",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "12",
//         title: "Masalah Asma",
//         lastMessage: "Pencegahan serangan asma",
//         timestamp: "2024-03-03 10:45",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "13",
//         title: "Konsultasi Mata",
//         lastMessage: "Masalah penglihatan kabur",
//         timestamp: "2024-03-01 13:20",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "14",
//         title: "Masalah Gigi",
//         lastMessage: "Perawatan gigi berlubang",
//         timestamp: "2024-02-28 11:15",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "15",
//         title: "Konsultasi Vaksinasi",
//         lastMessage: "Jadwal vaksin anak",
//         timestamp: "2024-02-25 09:30",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "16",
//         title: "Masalah Tulang",
//         lastMessage: "Pencegahan osteoporosis",
//         timestamp: "2024-02-23 14:45",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "17",
//         title: "Konsultasi Jantung",
//         lastMessage: "Gejala serangan jantung",
//         timestamp: "2024-02-20 15:20",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "18",
//         title: "Masalah THT",
//         lastMessage: "Pengobatan sinusitis",
//         timestamp: "2024-02-18 10:30",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "19",
//         title: "Konsultasi Kehamilan",
//         lastMessage: "Nutrisi ibu hamil",
//         timestamp: "2024-02-15 13:15",
//         group: "Previous 30 Days"
//     },
//     {
//         id: "20",
//         title: "Masalah Kulit",
//         lastMessage: "Perawatan jerawat",
//         timestamp: "2024-02-12 16:45",
//         group: "Previous 30 Days"
//     }
// ];

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const [chatHistories, setChatHistories] = useState([]);

    useEffect(() => {
        axios
            .get("/api/chat/histories")
            .then((res) => {
                setChatHistories(res.data.histories); // <--- penting!
            })
            .catch(() => {
                setChatHistories([]);
            });
    }, []);

    return (
        <AppShell variant="sidebar">
            <AppSidebarChatHistory chatHistories={chatHistories} />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
