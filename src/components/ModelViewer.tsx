"use client"

import { Canvas } from "@react-three/fiber"
import { Stage, OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url)
    return <primitive object={scene} />
}

export function ModelViewer({ modelUrl }: { modelUrl: string }) {
    return (
        <div className="w-full h-[500px] bg-black/20 rounded-xl overflow-hidden relative border border-white/5">
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            }>
                <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                    <Stage environment="city" intensity={0.6}>
                        <Model url={modelUrl} />
                    </Stage>
                    <OrbitControls makeDefault autoRotate />
                </Canvas>
            </Suspense>
        </div>
    )
}
