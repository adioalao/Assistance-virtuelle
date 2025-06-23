"use client"

export default function BounceLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
            <div className="flex space-x-4">
                {["#EF4444", "#3B82F6", "#10B981"].map((color, i) => (
                    <span
                        key={i}
                        style={{
                            backgroundColor: color,
                            animationDelay: `${i * 0.2}s`,
                        }}
                        className="w-6 h-6 rounded-full animate-bounce"
                    />
                ))}
            </div>
        </div>
    )
}
