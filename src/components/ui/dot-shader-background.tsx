"use client";

import { cn } from "@/lib/utils";

interface DotScreenShaderProps {
    className?: string;
}

export function DotScreenShader({ className }: DotScreenShaderProps) {
    return (
        <div className={cn("absolute inset-0 h-full w-full bg-background", className)}>
            <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
        </div>
    );
}
