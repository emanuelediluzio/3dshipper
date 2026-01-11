"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadSection } from "@/components/UploadSection"
import { ProcessingView } from "@/components/ProcessingView"
import { ModelViewer } from "@/components/ModelViewer"
import { Button } from "@/components/ui/button"
import { RotateCw, Download, Github } from "lucide-react"

type AppState = "upload" | "processing" | "result"

export default function Home() {
  const [step, setStep] = useState<AppState>("upload")
  const [modelUrl, setModelUrl] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setStep("processing")

    // TODO: Implement actual API call here
    // For now, simulate processing delay and return a dummy model
    // Using a sample GLB from three.js repo or similar public source if possible, or just a placeholder
    // I'll leave it as a mock timeout for now.

    setTimeout(() => {
      // Mock result
      // Using a public model for demo purposes. 
      // This is a placeholder. In real app, this comes from the backend.
      setModelUrl("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb")
      setStep("result")
    }, 4000)
  }

  const handleReset = () => {
    setStep("upload")
    setModelUrl(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-background text-foreground overflow-hidden relative">

      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <header className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex mb-12">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tighter">
          <div className="h-6 w-6 bg-primary rounded-full" />
          Hunyuan3D
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/Tencent-Hunyuan/Hunyuan3D-Part" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center min-h-[50vh]">

        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-in-expand">
            Image to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">3D Model</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Turn any 2D image into a high-quality 3D asset using pure AI magic.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <UploadSection onFileSelect={handleFileSelect} />
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <ProcessingView />
              </motion.div>
            )}

            {step === "result" && modelUrl && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <ModelViewer modelUrl={modelUrl} />

                <div className="flex gap-4 justify-center">
                  <Button onClick={handleReset} variant="outline" className="gap-2">
                    <RotateCw className="h-4 w-4" />
                    Generate Another
                  </Button>
                  <Button className="gap-2" onClick={() => window.open(modelUrl, '_blank')}>
                    <Download className="h-4 w-4" />
                    Download GLB
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <footer className="z-10 w-full max-w-5xl text-center text-xs text-muted-foreground mt-12">
        <p>Powered by Hunyuan3D P3-SAM • Built for Vercel</p>
      </footer>
    </main>
  )
}
