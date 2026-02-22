import {Button} from "@/components/ui/button";
import Image from "next/image"
import DataCard from "@/components/DataCard";
import {Camera, MapPin, Users, TrendingUp} from 'lucide-react'
import Link from "next/link"

type Step = {
    title: string
    description: string
}

const steps: Step[] = [
    {
        title: "Spot an Animal",
        description: "See wildlife in your area? Take a photo if possible.",
    },
    {
        title: "Submit a Report",
        description: "Fill out our simple form with details about your sighting.",
    },
    {
        title: "Help Conservation",
        description:
            "Your data helps researchers track wildlife populations and protect habitats.",
    },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <main>
                <section className="relative h-180 overflow-hidden">
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
                        <p className="mt-4 text-xl">
                            Interactive visualization of spatial data and analytics.
                        </p>
                        <Button className="mt-6 bg-emerald-600 px-8 py-6 text-lg hover:bg-emerald-700" size="lg">
                            <Link href={"/report"}>
                                Report a Sighting
                            </Link>
                        </Button>
                    </div>
                </section>
                <section className="mx-auto my-20 flex max-w-6xl flex-col items-center text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        Why Report Your Sightings?
                    </h1>
                    <p className="mt-4 text-xl">
                        Your observations contribute to vital research and conservation efforts worldwide.
                    </p>
                    <div className="mt-10 flex w-full gap-5 px-6">
                        <DataCard icon={Camera} title="Photo Evidence">
                            <p>
                                Upload images of your wildlife sightings to help verify and document species.
                            </p>
                        </DataCard>
                        <DataCard icon={MapPin} title="Location Tracking">
                            <p>
                                Record exact locations to help researchers understand animal migration patterns.
                            </p>
                        </DataCard>
                        <DataCard icon={Users} title="Community Driven">
                            <p>
                                Join a community of wildlife enthusiasts and contribute to conservation efforts.
                            </p>
                        </DataCard>
                        <DataCard icon={TrendingUp} title="Track Trends">
                            <p>
                                Help scientists identify population trends and endangered species.
                            </p>
                        </DataCard>
                    </div>
                </section>
                <section className="grid grid-cols-2 items-center">
                    <section className="max-w-6xl px-24 py-12 sm:px-12">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            How It Works
                        </h1>

                        <div className="mt-10 space-y-10">
                            {steps.map((step, idx) => (
                                <div key={step.title} className="flex items-start gap-6">
                                    <div
                                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-lg font-semibold text-white">
                                        {idx + 1}
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-semibold">{step.title}</h3>
                                        <p className="text-lg text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="relative h-full w-full">
                        <Image src="/photograph.png" alt="Picture" className="object-cover" fill/>
                    </section>
                </section>
                <section className="flex h-96 flex-col items-center justify-center gap-5 bg-emerald-600 text-white">
                    <h1 className="text-4xl font-bold">
                        Ready to Make a Difference?
                    </h1>
                    <Button className="bg-white px-8 py-6 text-lg text-emerald-600 hover:bg-gray-100">
                        <Link href={"/report"}>
                            Submit Your First Report
                        </Link>
                    </Button>
                </section>
            </main>
        </div>
    )
}
