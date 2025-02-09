// hooks/useImagePreloader.ts
import { useEffect } from 'react'

export function useImagePreloader(imageUrls: string[]) {
  useEffect(() => {
    imageUrls.forEach(url => {
      if (!url) return
      const img = new Image()
      img.src = url
    })
  }, [imageUrls])
}