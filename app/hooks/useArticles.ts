// app/hooks/useArticles.ts
'use client'

import { useState, useEffect } from 'react'
import { WikiArticle, ArticlesResponse } from '../types'
import { trpc } from '@/app/_trpc/client'
import { useInView } from 'react-intersection-observer'

export function useArticles(initialArticle: WikiArticle) {
  const [articles, setArticles] = useState<WikiArticle[]>([initialArticle])
  const [pageParam, setPageParam] = useState<number>(1)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  const { data, isLoading } = trpc.getArticles.useQuery(
    {
      pageParam,
      limit: 5,
    },
    {
      enabled: inView,
      onSuccess: (newData) => {
        if (newData.items.length > 0) {
          setArticles(prev => [...prev, ...newData.items])
          setPageParam(newData.nextCursor)
        }
      }
    }
  )

  return {
    articles,
    isLoading,
    ref,
    hasNextPage: data?.items.length === 5
  }
}