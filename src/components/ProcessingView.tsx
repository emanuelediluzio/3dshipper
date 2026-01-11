"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function ProcessingView() {
    return (
        <div className="w-full max-w-xl mx-auto h-[400px] flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
                {/* Glowing orb effect */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative z-10 rounded-full bg-muted p-6"
                >
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </motion.div>
            </div>

            <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-medium tracking-tight">Generating 3D Model...</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    This may take a few seconds depending on the complexity of the image and server load.
                </p>
            </div>

            <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "easeInOut" }}
                />
            </div>
        </div>
    )
}
