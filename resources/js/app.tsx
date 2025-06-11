import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { initializeTheme } from "./hooks/use-appearance";
import axios from "axios";

// --- PERBAIKAN FINAL DI SINI ---
// 1. Ambil token dari localStorage
const token = localStorage.getItem("access_token");

// 2. Hanya atur header jika tokennya ada (tidak null)
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
// --- SELESAI PERBAIKAN ---

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

// This will set light / dark mode on load...
initializeTheme();
