'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, File, X } from 'lucide-react'
import { useApp } from '@/context/app-context'

interface FileUploadProps {
  onUploadComplete?: () => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { setResumeFile } = useApp()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      setUploading(true)
      setProgress(0)

      try {
        // Store the file in context
        setResumeFile(file)

        // Simulate upload progress
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)
            setUploading(false)
            onUploadComplete?.()
          }
        }, 100)
      } catch (error) {
        console.error('Error handling file:', error)
        setUploading(false)
      }
    }
  }, [setResumeFile, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  })

  const removeFile = () => {
    setFile(null)
    setProgress(0)
    setResumeFile(null)
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${file ? 'bg-muted/50' : 'hover:bg-muted/50'}`}
      >
        <input {...getInputProps()} />
        {!file && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-muted-foreground">
              {isDragActive ? (
                <p>Drop the file here</p>
              ) : (
                <p>Drag & drop your resume here, or click to select</p>
              )}
              <p className="text-xs mt-2">Supports PDF and DOCX files</p>
            </div>
          </div>
        )}
        
        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <File className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {uploading && (
              <Progress value={progress} className="h-1" />
            )}
          </div>
        )}
      </div>
    </div>
  )
} 