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
        <div className="max-w-2xl rounded-2xl border p-6 flex flex-col gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="border"
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
