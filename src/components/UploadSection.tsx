"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileImage, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadSectionProps {
    onFileSelect: (file: File) => void
}

export function UploadSection({ onFileSelect }: UploadSectionProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            setFile(selectedFile)
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
    })

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFile(null)
        setPreview(null)
    }

    const handleContinue = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (file) {
            onFileSelect(file)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-xl border border-dashed border-muted-foreground/25 bg-muted/50 transition-all hover:bg-muted/80 hover:border-muted-foreground/50",
                    isDragActive && "border-primary/50 bg-primary/5",
                    preview ? "h-[400px]" : "h-[300px]"
                )}
            >
                <input {...getInputProps()} />

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
                            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        >
                            {/* Background Blur Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl"
                                style={{ backgroundImage: `url(${preview})` }}
                            />

                            {/* Main Preview Image */}
                            <div className="relative z-10 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-[300px] w-auto rounded-lg shadow-2xl ring-1 ring-white/10"
                                />

                                <div className="absolute top-6 right-6 flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full bg-black/50 backdrop-blur hover:bg-black/70 text-white border-white/10"
                                        onClick={clearSelection}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full flex justify-center">
                                    <Button
                                        onClick={handleContinue}
                                        className="gap-2 rounded-full px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-2 ring-primary/20"
                                    >
                                        Generate 3D Model <ArrowRight className="h-4 w-4" />
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
