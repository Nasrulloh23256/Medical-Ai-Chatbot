import AppLogoIcon from "@/components/app-logo-icon";
import { type SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { type PropsWithChildren, useState, useEffect } from "react";

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const MEDICAL_IMAGES = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80", // Medical professional
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80", // Laboratory
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80", // Healthcare
    "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&q=80", // Healthcare
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80", // Stethoscope
];

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Carousel auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % MEDICAL_IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900/70" /> {/* Darkened overlay for readability */}
                {/* Medical Carousel */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {MEDICAL_IMAGES.map((img, index) => (
                        <div
                            key={img}
                            className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out"
                            style={{
                                opacity: currentImageIndex === index ? 1 : 0,
                                backgroundImage: `url(${img})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                zIndex: 0,
                            }}
                        />
                    ))}
                </div>
                <Link href={route("home")} className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    <span className="text-white ms-2">{name}</span>
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-neutral-300">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
                {/* Carousel Indicators */}
                <div className="relative z-20 mt-4 flex justify-center space-x-2">
                    {MEDICAL_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 w-2 rounded-full ${
                                currentImageIndex === index ? "bg-white" : "bg-white/50"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route("home")} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
