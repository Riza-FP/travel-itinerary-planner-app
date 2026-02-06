"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TripInputForm, TripFormData } from "@/components/TripInputForm";
import { Plane, Compass, Ticket, Map as MapIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function PlanPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // API Call Handler
    const handleGenerate = async (data: TripFormData) => {
        setIsLoading(true);

        try {
            // Transform data structure to match what API expects
            const payload = {
                ...data,
                dateRange: {
                    from: format(data.startDate, "yyyy-MM-dd"),
                    to: format(data.endDate, "yyyy-MM-dd"),
                }
            };

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to generate itinerary");
            }

            const result = await response.json();

            // Save to Local Storage for the Preview Page to pick up
            localStorage.setItem("currentTrip", JSON.stringify({
                itinerary: result.itinerary,
                budget: result.budget,
                weather: result.weather,
                hotels: result.hotels,
                formData: data
            }));

            toast.success("Itinerary generated! Redirecting...");
            router.push("/itinerary/preview");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong! Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-emerald-50 dark:bg-zinc-950 flex flex-col lg:flex-row">
            {isLoading && <LoadingScreen />}

            {/* Left Column: Visuals (Hidden on mobile, Fixed on Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative bg-emerald-900 text-white min-h-screen sticky top-0">
                {/* Background Texture/Image */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/planning-vector.png"
                        alt="Planning Illustration"
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/80 to-teal-900/80 backdrop-blur-[1px]" />
                </div>

                {/* Top: Brand/Back */}
                <div className="relative z-10">
                    <Button variant="ghost" asChild className="text-emerald-100 hover:text-white hover:bg-white/10 -ml-4">
                        <Link href="/" className="flex items-center gap-2 font-medium">
                            <ArrowLeft className="w-5 h-5" /> Back to Home
                        </Link>
                    </Button>
                </div>

                {/* Center: Illustration & Motivational Text */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-2xl animate-in zoom-in duration-700">
                        <img
                            src="/planning-vector.png"
                            alt="Planning Vector"
                            className="w-64 h-64 object-contain drop-shadow-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-black font-serif tracking-tight text-white leading-tight">
                            Design Your <span className="text-orange-400">Perfect</span> Getaway
                        </h2>
                        <p className="text-lg text-emerald-100/80 font-medium">
                            Whether it&apos;s a solo adventure or a family vacation, our AI handles the details so you can focus on the memories.
                        </p>
                    </div>

                    <div className="flex gap-4 opacity-70">
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                            <Ticket className="w-4 h-4" /> Smart Booking
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                            <Compass className="w-4 h-4" /> Hidden Gems
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-200">
                            <MapIcon className="w-4 h-4" /> Optimized Routes
                        </div>
                    </div>
                </div>

                {/* Bottom: Footer */}
                <div className="relative z-10 text-xs text-emerald-300/50 text-center">
                    Pathfinder &copy; 2024
                </div>
            </div>

            {/* Right Column: Form (Scrollable) */}
            <div className="w-full lg:w-1/2 min-h-screen bg-emerald-50 dark:bg-zinc-950 flex flex-col">
                {/* Mobile Header (Only visible on small screens) */}
                <div className="lg:hidden p-4 border-b border-emerald-100 bg-white/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-emerald-900">
                        <Plane className="w-6 h-6 text-orange-500" /> Pathfinder
                    </Link>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">Close</Link>
                    </Button>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 md:p-12 lg:p-16">
                    <div className="w-full max-w-xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-700">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
                                New Trip
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-950 tracking-tight">
                                Where are you headed?
                            </h1>
                            <p className="text-emerald-700/70">
                                Fill in the details below to generate your custom itinerary.
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white shadow-xl shadow-emerald-900/5 border border-emerald-100 rounded-3xl p-6 md:p-8">
                            <TripInputForm onSubmit={handleGenerate} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
