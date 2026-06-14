'use client'

import { useCallback, useState } from 'react'
import { Upload, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CloudinaryAsset, MediaFolder } from '@/lib/types/cloudinary-asset'

interface MediaUploadProps {
  folder: MediaFolder
  onUpload: (asset: CloudinaryAsset) => void
  accept?: string
  className?: string
}

export function MediaUpload({ folder, onUpload, accept = 'image/*', className }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Upload failed')
        onUpload(data.asset)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setUploading(false)
      }
    },
    [folder, onUpload]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Drag & drop an image, or click to browse
            </p>
            <label>
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
              <Button type="button" variant="outline" size="sm" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
