"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadSection } from "@/components/UploadSection"
import { Github, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiSubmit = async (file: File, email: string) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('email', email)

    try {
      setError(null)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setError(errorData.error || 'Submission failed. Please try again.')
        return
      }

      setIsSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
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
          <a href="https://github.com/Tencent-Hunyuan/Hunyuan3D-Part" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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
            Richiedi la generazione del tuo modello 3D AI.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm"
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <UploadSection onApiSubmit={handleApiSubmit} />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-muted-foreground/25 rounded-xl p-12 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">Richiesta Inviata!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Abbiamo ricevuto la tua immagine. Entro 24 ore riceverai un&apos;email con l&apos;anteprima video del tuo modello 3D e le opzioni per la stampa.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Invia un&apos;altra richiesta
                </Button>
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
