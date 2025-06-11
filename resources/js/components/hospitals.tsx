// resources/js/components/hospitals.tsx

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Pastikan path ini sesuai dengan struktur proyek Anda

interface Hospital {
    id: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    distance: number;
}

export default function Hospitals({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);

    // Fungsi Haversine untuk menghitung jarak tetap sama
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius bumi dalam km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        if (!open) return;

        // Reset state setiap kali dialog dibuka
        setHospitals([]);
        setStatus("loading");
        setError(null);

        if (!navigator.geolocation) {
            setError("Browser Anda tidak mendukung geolokasi.");
            setStatus("error");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const radius = 10000; // 10 km
                const overpassQuery = `[out:json];node["amenity"="hospital"](around:${radius},${latitude},${longitude});out body;`;
                const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

                try {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error("Gagal menghubungi Overpass API.");

                    const data = await res.json();
                    if (!data.elements || data.elements.length === 0) {
                        setHospitals([]);
                        setStatus("success"); // Sukses, tapi tidak ada data
                        return;
                    }

                    const hospitalsFromOsm = data.elements
                        .filter((el: any) => el.tags?.amenity === "hospital")
                        .map((el: any) => ({
                            id: `osm-${el.id}`,
                            name: el.tags?.name || "Rumah Sakit Tanpa Nama",
                            address:
                                el.tags?.["addr:full"] ||
                                `${el.tags?.["addr:street"] || ""} ${el.tags?.["addr:city"] || ""}`.trim() ||
                                "Alamat tidak diketahui",
                            latitude: el.lat,
                            longitude: el.lon,
                            distance: haversineDistance(latitude, longitude, el.lat, el.lon),
                        }));

                    hospitalsFromOsm.sort((a, b) => a.distance - b.distance);
                    setHospitals(hospitalsFromOsm);
                    setStatus("success");
                } catch (e: any) {
                    console.error("Overpass API error:", e);
                    setError("Gagal mengambil data rumah sakit. Silakan coba lagi nanti.");
                    setStatus("error");
                }
            },
            (geoError) => {
                setError("Gagal mendapatkan lokasi Anda. Izinkan akses lokasi untuk menemukan rumah sakit terdekat.");
                setStatus("error");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [open]);

    const renderContent = () => {
        switch (status) {
            case "loading":
                return (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div className="flex items-center space-x-4" key={i}>
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "success":
                if (hospitals.length === 0) {
                    return (
                        <p className="text-center text-muted-foreground">
                            Tidak ada rumah sakit yang ditemukan di sekitar Anda.
                        </p>
                    );
                }
                return (
                    <div className="max-h-80 space-y-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {hospitals.map((hospital) => (
                            <div key={hospital.id} className="flex items-start justify-between space-x-4">
                                <div className="flex flex-grow items-start space-x-4">
                                    <Avatar className="h-12 w-12 flex-shrink-0">
                                        <AvatarFallback>{hospital.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{hospital.name}</p>
                                        <p className="text-sm text-muted-foreground">{hospital.address}</p>
                                        <Button asChild variant="link" className="h-auto p-0 mt-1 text-xs">
                                            <a
                                                href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Lihat di Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                        {hospital.distance.toFixed(2)} km
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "error":
                return (
                    <div className="text-center">
                        <p className="text-destructive">{error}</p>
                        <Button variant="link" onClick={onClose}>
                            Tutup
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Rumah Sakit Terdekat</DialogTitle>
                </DialogHeader>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}
