'use client'
import dynamic from "next/dynamic"

const SightingsMap = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center">Loading...</div>
})

export default function ReportPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="h-192">
                <SightingsMap />
            </div>
        </div>
    )
}
