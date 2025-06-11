// resources/js/components/nearby-doctors-list.tsx

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { Doctor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NearbyDoctorsList() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [status, setStatus] = useState<"prompting" | "loading" | "cityInput" | "success" | "error">("prompting");
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState("");

    const fetchDoctorsByCoords = (latitude: number, longitude: number) => {
        setStatus("loading");
        axios
            .get<Doctor[]>("/api/doctors/nearby", { params: { latitude, longitude } })
            .then((response) => {
                setDoctors(response.data);
                if (response.data.length > 0) {
                    setStatus("success");
                } else {
                    setError("Tidak ada dokter yang ditemukan di dekat Anda. Coba cari berdasarkan kota.");
                    setStatus("cityInput");
                }
            })
            .catch(() => {
                setError("Gagal memuat daftar dokter. Coba cari berdasarkan kota.");
                setStatus("cityInput");
            });
    };

    const fetchDoctorsByCity = (e: FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;
        setStatus("loading");
        axios
            .get<Doctor[]>("/api/doctors/nearby", { params: { city } })
            .then((response) => {
                setDoctors(response.data);
                if (response.data.length > 0) {
                    setStatus("success");
                } else {
                    setError(`Tidak ada dokter yang ditemukan untuk kota "${city}".`);
                    setStatus("error");
                }
            })
            .catch(() => {
                setError("Gagal memuat daftar dokter. Silakan coba lagi nanti.");
                setStatus("error");
            });
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchDoctorsByCoords(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    setStatus("cityInput");
                    setError("Izinkan lokasi untuk hasil terbaik, atau cari dokter berdasarkan nama kota Anda.");
                }
            );
        } else {
            setStatus("cityInput");
            setError("Browser Anda tidak mendukung geolokasi. Silakan cari berdasarkan kota.");
        }
    }, []);

    const renderContent = () => {
        switch (status) {
            case "prompting":
                return <p className="text-center text-muted-foreground">Meminta izin lokasi...</p>;
            case "loading":
                return (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div className="flex items-center space-x-4" key={i}>
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "cityInput":
                return (
                    <form onSubmit={fetchDoctorsByCity} className="space-y-4">
                        {error && <p className="text-sm text-center text-muted-foreground">{error}</p>}
                        <Input
                            type="text"
                            placeholder="Masukkan nama kota"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">
                            Cari Dokter
                        </Button>
                    </form>
                );
            case "success":
                return (
                    <div className="max-h-80 space-y-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="flex items-start justify-between space-x-4">
                                <div className="flex flex-grow items-start space-x-4">
                                    <Avatar className="h-12 w-12 flex-shrink-0">
                                        <AvatarImage src={doctor.profile_picture_url} alt={doctor.name} />
                                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{doctor.name}</p>
                                        <p className="text-sm font-medium text-primary">{doctor.specialization}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{doctor.bio}</p>
                                    </div>
                                </div>
                                {doctor.jarak !== null && (
                                    <div className="flex-shrink-0 text-right">
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {doctor.jarak.toFixed(2)} km
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case "error":
                return (
                    <div className="text-center">
                        <p className="text-destructive">{error}</p>
                        <Button variant="link" onClick={() => setStatus("cityInput")}>
                            Coba cari lagi
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return <div>{renderContent()}</div>;
}
