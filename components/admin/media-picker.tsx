'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediaUpload } from './media-upload'
import type { CloudinaryAsset, MediaFolder } from '@/lib/types/cloudinary-asset'

interface MediaPickerProps {
  folder: MediaFolder
  value?: CloudinaryAsset | null
  onChange: (asset: CloudinaryAsset | null) => void
  label?: string
  multiple?: false
}

interface MediaPickerMultipleProps {
  folder: MediaFolder
  value?: CloudinaryAsset[]
  onChange: (assets: CloudinaryAsset[]) => void
  label?: string
  multiple: true
}

type Props = MediaPickerProps | MediaPickerMultipleProps

export function MediaPicker(props: Props) {
  const { folder, label = 'Image' } = props
  const [showUpload, setShowUpload] = useState(false)

  if (props.multiple) {
    const { value = [], onChange } = props

    const addAsset = (asset: CloudinaryAsset) => {
      onChange([...value, asset])
      setShowUpload(false)
    }

    const removeAsset = (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    }

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium">{label}</label>
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {value.map((asset, i) => (
              <div key={asset.public_id} className="relative aspect-square rounded-md overflow-hidden border">
                <Image src={asset.secure_url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeAsset(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        {showUpload ? (
          <MediaUpload folder={folder} onUpload={addAsset} />
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowUpload(true)}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>
    )
  }

  const { value, onChange } = props

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      {value?.secure_url ? (
        <div className="relative w-full max-w-xs aspect-video rounded-md overflow-hidden border">
          <Image src={value.secure_url} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ) : showUpload ? (
        <MediaUpload
          folder={folder}
          onUpload={(asset) => { onChange(asset); setShowUpload(false) }}
        />
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowUpload(true)}>
          <ImageIcon className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      )}
    </div>
  )
}
