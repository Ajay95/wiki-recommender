'use client'

import { ArticleCard } from './ArticleCard'
import { WikiArticle } from '@/app/types'
import { useArticles } from '../hooks/useArticles'
import { useEffect } from 'react'

interface ArticleListProps {
  initialArticle: WikiArticle
}

export function ArticleList({ initialArticle }: ArticleListProps) {
  console.log('ArticleList rendering with initialArticle:', initialArticle)
  
  const { articles, isLoading, ref, refresh } = useArticles(initialArticle)
  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory">
      {articles.map((article, index) => {
        console.log(`Rendering article ${index}:`, article)
        return (
          <div 
            key={article.id} 
            className="snap-start h-screen"
            ref={index === articles.length - 1 ? ref : undefined}
          >
            <ArticleCard
              article={article}
              onLike={() => {
                console.log('Like clicked for article:', article.id)
              }}
              onDislike={() => {
                console.log('Dislike clicked for article:', article.id)
              }}
              onView={() => {
                console.log('Article viewed:', article.id)
              }}
            />
          </div>
        )
      })}
      {isLoading && (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}