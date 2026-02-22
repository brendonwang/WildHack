import {Navbar} from "@/components/navbar"
import {Button} from "@/components/ui/button";
import Image from "next/image"
import Link from "next/link"
import DataCard from "@/components/DataCard";
import {Camera, MapPin, Users, TrendingUp} from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <main className="w-full">
                <section
                    className="relative h-[400px] w-full overflow-hidden">
                    <Image
                        src="/background.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-8 text-center text-white">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            Track Wildlife, Protect Nature
                        </h1>
                        <p className="mt-4 text-xl ">
                            Interactive visualization of spatial data and analytics.
                        </p>
                        <Button className="mt-4 text-2xl p-6 bg-emerald-600" size="lg">
                            Report a Sighting
                        </Button>
                    </div>
                </section>
                <section className="mx-auto my-6 flex w-full max-w-6xl flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        Why Report Your Sightings?
                    </h1>
                    <p className="mt-4 text-xl ">
                        Your observations contribute to vital research and conservation efforts worldwide.
                    </p>
                    <div className="flex gap-5 mt-4">
                        <DataCard icon={Camera} title="Photo Evidence">
                            <p>
                                Upload images of your wildlife sightings to help verify and document species.
                            </p>
                        </DataCard>
                        <DataCard icon={MapPin} title="Location Tracking">
                            <p>
                                Record exact locations to help researchers understand animal migration patterns.
                            </p>
                        </DataCard> <DataCard icon={Users} title="Community Driven">
                        <p>
                            Join a community of wildlife enthusiasts and contribute to conservation efforts.
                        </p>
                    </DataCard> <DataCard icon={TrendingUp} title="Track Trends">
                        <p>
                            Help scientists identify population trends and endangered species.
                        </p>
                    </DataCard>
                    </div>
                </section>
                <section
                    className="w-full bg-emerald-600 h-96 flex flex-col items-center justify-center align-middle gap-5 text-white">
                    <h1 className="text-4xl font-bold">
                        Ready to Make a Difference?
                    </h1>
                    <Button className="bg-white text-emerald-600 text-lg py-6 px-8 hover:bg-gray-100">
                        Submit Your First Report
                    </Button>
                </section>
            </main>
        </div>
    )
}
