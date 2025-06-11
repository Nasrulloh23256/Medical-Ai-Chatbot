import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { User } from "@/types";
import axios from "axios";

const pricingPlans = [
    {
        name: "Paket Dasar",
        price: 0,
        period: "selamanya",
        originalPrice: 0,
        features: [
            { name: "Konsultasi dokter umum", included: true },
            { name: "Riwayat chat tak terbatas", included: true },
            { name: "Akses artikel kesehatan", included: true },
            { name: "Konsultasi spesialis", included: false },
            { name: "Prioritas antrian", included: false },
        ],
    },
    {
        name: "Paket Profesional",
        price: 599000,
        period: "bulan",
        originalPrice: 999000,
        popular: true,
        features: [
            { name: "Konsultasi dokter umum", included: true },
            { name: "Riwayat chat tak terbatas", included: true },
            { name: "Akses artikel kesehatan", included: true },
            { name: "Konsultasi spesialis", included: true },
            { name: "Prioritas antrian", included: true },
        ],
    },
    {
        name: "Paket Bisnis",
        price: 499000,
        period: "bulan",
        originalPrice: 499000,
        features: [
            { name: "Konsultasi dokter umum", included: true },
            { name: "Riwayat chat tak terbatas", included: true },
            { name: "Akses artikel kesehatan", included: true },
            { name: "Konsultasi spesialis", included: true },
            { name: "Prioritas antrian", included: false },
        ],
    },
];

export default function UpgradePlan() {
    const user = usePage().props.auth.user as User;
    const activePlanName = user.plan === "pro" ? "Paket Profesional" : "Paket Dasar";

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherStatus, setVoucherStatus] = useState<"success" | "error" | "">("");
    const [voucherMessage, setVoucherMessage] = useState("");
    const [loadingVoucher, setLoadingVoucher] = useState(false);

    const handleRedeemVoucher = async () => {
        setLoadingVoucher(true);
        setVoucherStatus("");
        setVoucherMessage("");

        try {
            const response = await axios.post("/api/vouchers/redeem", { code: voucherCode });

            setVoucherStatus("success");
            setVoucherMessage(response.data.message || "Selamat! Paket Anda berhasil di-upgrade.");
            setVoucherCode("");
            console.log("Voucher redeemed successfully:", response.data);

            router.reload({ only: ["auth"] });
        } catch (error: any) {
            setVoucherStatus("error");
            if (error.response && error.response.data && error.response.data.message) {
                setVoucherMessage(error.response.data.message);
            } else {
                setVoucherMessage("Terjadi kesalahan. Silakan coba lagi.");
                console.error("Error redeeming voucher:", error);
            }
        } finally {
            setLoadingVoucher(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Paket Langganan" />
            <div className="flex min-h-full flex-col items-center px-4 py-12">
                <div className="max-w-2xl w-full mx-auto mb-8 bg-card rounded-xl p-6 shadow">
                    <h2 className="font-bold text-lg mb-2">Punya kode voucher?</h2>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2 bg-background"
                            placeholder="Masukkan kode voucher"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            disabled={loadingVoucher}
                        />
                        <button
                            className="rounded bg-primary text-primary-foreground px-4 py-2 font-semibold disabled:bg-muted disabled:cursor-not-allowed"
                            onClick={handleRedeemVoucher}
                            disabled={loadingVoucher || !voucherCode.trim()}
                        >
                            {loadingVoucher ? "Cek..." : "Redeem"}
                        </button>
                    </div>
                    {voucherMessage && (
                        <div
                            className={`mt-2 text-sm ${voucherStatus === "success" ? "text-green-600" : "text-red-600"}`}
                        >
                            {voucherMessage}
                        </div>
                    )}
                </div>

                <div className="mb-4 text-center">
                    <span className="inline-block bg-green-50 text-green-800 rounded px-3 py-1 font-medium">
                        Plan aktif: {activePlanName}
                    </span>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">PAKET LAYANAN</h2>
                    <h1 className="text-4xl font-bold text-foreground">Pilihan Paket</h1>
                </div>

                <div className="grid gap-8 md:grid-cols-3 max-w-7xl w-full">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border flex flex-col ${
                                // Tambahkan flex flex-col
                                plan.popular ? "ring-2 ring-primary" : ""
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-violet-400 to-violet-600 px-3 py-1 text-sm font-medium text-white">
                                    Paling Populer
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline">
                                    {plan.price === 0 ? (
                                        <span className="text-4xl font-bold tracking-tight text-foreground">
                                            Gratis
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-bold tracking-tight text-foreground">
                                                Rp{plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-lg font-semibold text-muted-foreground">
                                                /{plan.period}
                                            </span>
                                            <span className="ml-2 text-sm text-muted-foreground line-through">
                                                Rp{plan.originalPrice.toLocaleString()}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Menambahkan div kosong untuk menjaga layout tetap sama */}
                            <div className="mb-6 h-[42px]">
                                {/* --- PERUBAHAN DI SINI --- */}
                                {/* Tombol hanya akan muncul jika harga paket > 0 */}
                                {plan.price > 0 && (
                                    <button
                                        className="w-full rounded-lg border border-border bg-card py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-colors
                                            disabled:opacity-70"
                                        disabled={plan.name === activePlanName}
                                    >
                                        {plan.name === activePlanName ? "Paket Aktif" : "Hubungi Admin untuk Upgrade"}
                                    </button>
                                )}
                            </div>

                            <ul className="space-y-4 flex-1">
                                {" "}
                                {/* Tambahkan flex-1 */}
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
                                        ) : (
                                            <X className="h-5 w-5 text-red-500 dark:text-red-400" />
                                        )}
                                        <span className="text-muted-foreground">{feature.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
