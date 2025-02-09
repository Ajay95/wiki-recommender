'use client'
import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { WikiArticle } from '@/app/types'

interface ArticleCardProps {
  article: WikiArticle;
  priority?: boolean;
  onImageLoad?: () => void;
  onLike: () => void;
  onDislike: () => void;
  onView: () => void;  // New prop for view tracking
}

export function ArticleCard({ 
  article, 
  priority = false, 
  onImageLoad,
  onLike,
  onDislike, 
  onView 
}: ArticleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  // View tracking
  useEffect(() => {
    if (inView && !hasBeenViewed) {
      const timer = setTimeout(() => {
        setHasBeenViewed(true)
        onView()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [inView, hasBeenViewed, onView])

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newLikeState = !isLiked
    setIsLiked(newLikeState)
    if (newLikeState) {
      setIsDisliked(false)
      onLike()
    }
  }

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newDislikeState = !isDisliked
    setIsDisliked(newDislikeState)
    if (newDislikeState) {
      setIsLiked(false)
      onDislike()
    }
  }

  return (
    <section ref={ref} className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-black">
      {/* Image with fallback */}
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          className={`w-full h-full object-cover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            console.log("Image loaded:", article.imageUrl);
            setImageLoaded(true)
            setImageError(false)
            onImageLoad?.()
          }}
          onError={() => {
            console.log("Image error:", article.imageUrl);
            setImageError(true)
            setImageLoaded(false)
            onImageLoad?.()
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <span className="text-white text-lg">No image available</span>
        </div>
      )}

      {/* Loading state */}
      {!imageLoaded && !imageError && article.imageUrl && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-8 left-0 right-0 px-8 z-10">
        <h2 className="text-2xl font-bold text-white mb-3">
          {article.title || 'Untitled'}
        </h2>
        <p className="text-white/90 text-base mb-4 line-clamp-3">
          {article.text || 'No description available'}
        </p>
        {article.url && (
          <a 
            href={article.url} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4C9EEA] hover:text-[#4C9EEA]/80 text-sm font-medium"
          >
            Read more on Wikipedia
          </a>
        )}
      </div>

      {/* Buttons */}
      <div className="absolute right-6 bottom-32 flex flex-col items-center gap-6 z-50">
        <button 
          type="button"
          onClick={handleLike}
          className="bg-black/20 hover:bg-black/40 rounded-full p-3 flex items-center justify-center"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill={isLiked ? "white" : "none"} 
            stroke="white" 
            className="w-7 h-7"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.5"/>
          </svg>
        </button>
        
        <button 
          type="button"
          onClick={handleDislike}
          className="bg-black/20 hover:bg-black/40 rounded-full p-3 flex items-center justify-center"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill={isDisliked ? "white" : "none"} 
            stroke="white" 
            className="w-7 h-7 transform rotate-180"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>

      {/* Debug info */}
      <div className="absolute top-4 right-4 text-white text-xs bg-black/50 p-2 rounded">
        <div>ID: {article.id}</div>
        <div>Has Image: {article.imageUrl ? 'Yes' : 'No'}</div>
        <div>Image Loaded: {imageLoaded ? 'Yes' : 'No'}</div>
        <div>Image Error: {imageError ? 'Yes' : 'No'}</div>
        <div>Liked: {isLiked ? 'Yes' : 'No'}</div>
        <div>Disliked: {isDisliked ? 'Yes' : 'No'}</div>
      </div>
    </section>
  )
}