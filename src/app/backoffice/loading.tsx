"use client"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div className="flex flex-col items-center space-y-6">
                {/* Logo animé */}
                <motion.div
                    className="relative w-24 h-24"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                    }}
                >
                    <Image
                        src="/logoPort.png"
                        alt="Chargement..."
                        fill
                        className="object-contain"
                    />
                </motion.div>

                {/* Texte animé */}
                <motion.div
                    className="text-lg font-semibold tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Chargement en cours...
                </motion.div>
            </div>
        </div>
    )
}