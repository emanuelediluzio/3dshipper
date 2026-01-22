"use client"

import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadSectionProps {
    onApiSubmit: (file: File, email: string) => void
}

export function UploadSection({ onApiSubmit }: UploadSectionProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            setFile(selectedFile)
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)
        }
    }, [])

    // Cleanup object URL on unmount or when preview changes
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
    })

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (preview) {
            URL.revokeObjectURL(preview)
        }
        setFile(null)
        setPreview(null)
        setEmail("")
    }

    const handleSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (file && email) {
            setIsSubmitting(true)
            await onApiSubmit(file, email)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                {...(!preview ? getRootProps() : {})}
                className={cn(
                    "relative group rounded-xl border border-dashed border-muted-foreground/25 bg-muted/50 transition-all",
                    !preview && "cursor-pointer hover:bg-muted/80 hover:border-muted-foreground/50",
                    isDragActive && "border-primary/50 bg-primary/5",
                    preview ? "h-auto border-transparent bg-transparent" : "h-[300px]"
                )}
            >
                {!preview && <input {...getInputProps()} />}

                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="rounded-full bg-background p-4 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">
                                Upload an image
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                                Drag and drop or click to select a file.
                                Supports JPG, PNG, WEBP.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full"
                        >
                            <div className="rounded-xl border border-muted-foreground/25 bg-card overflow-hidden shadow-2xl">
                                <div className="relative h-[250px] w-full bg-black/50">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl"
                                        style={{ backgroundImage: `url(${preview})` }}
                                    />
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="relative z-10 h-full w-auto mx-auto object-contain p-4"
                                    />
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur hover:bg-black/70 text-white border-white/10 z-20"
                                        onClick={clearSelection}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            La tua Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="nome@esempio.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Riceverai il risultato qui.
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2 text-muted-foreground">
                                        <p>
                                            <span className="font-semibold text-foreground">Cosa succede ora?</span>
                                        </p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Entro 1 giorno lavorativo riceverai un video del modello 3D.</li>
                                            <li>Potrai scegliere se acquistare solo il file digitale o la stampa 3D spedita a casa.</li>
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!email || isSubmitting}
                                        className="w-full gap-2 text-lg py-6"
                                    >
                                        {isSubmitting ? (
                                            <>Invio in corso...</>
                                        ) : (
                                            <>Invia Richiesta <ArrowRight className="h-5 w-5" /></>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
