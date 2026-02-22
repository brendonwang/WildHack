import {type ReactNode} from "react";
import {type LucideIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

type DataCardProps = {
    icon: LucideIcon;
    title: ReactNode;
    children: ReactNode;
};

export default function DataCard({icon: Icon, title, children}: DataCardProps) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border p-6 hover:shadow-lg">
            <Button
                variant="ghost"
                size="icon"
                className="border  hover:bg-white"
            >
                <Icon/>
            </Button>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                {children}
            </div>
        </div>
    );
}
