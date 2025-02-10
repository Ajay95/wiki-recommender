'use client'

import { ArticleCard } from './ArticleCard'
import { WikiArticle } from '@/app/types'
import { useArticles } from '../hooks/useArticles'

interface ArticleListProps {
  initialArticle: WikiArticle
}

export function ArticleList({ initialArticle }: ArticleListProps) {
  const { articles, isLoading, ref } = useArticles(initialArticle)

  return (
    <div className="h-[100vh] w-full overflow-y-auto snap-y snap-mandatory touch-pan-y">
      {articles.map((article, index) => (
        <div 
          key={article.id} 
          className="snap-start h-screen"
          ref={index === articles.length - 1 ? ref : undefined}
        >
          <ArticleCard
            article={article}
            onLike={() => console.log('Like', article.id)}
            onDislike={() => console.log('Dislike', article.id)}
            onView={() => console.log('View', article.id)}
          />
        </div>
      ))}
      {isLoading && (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
        </div>
      )}
    </div>
  )
}