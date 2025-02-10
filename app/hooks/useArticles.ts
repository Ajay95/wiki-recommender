// app/hooks/useArticles.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { WikiArticle, ArticlesResponse } from '../types'
import { trpc } from '@/app/_trpc/client'
import { useInView } from 'react-intersection-observer'

// useArticles.ts
export function useArticles(initialArticle: WikiArticle) {
  const [articles, setArticles] = useState<WikiArticle[]>([initialArticle])
  const [pageParam, setPageParam] = useState<number>(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  const { data, isLoading, refetch } = trpc.getArticles.useQuery(
    {
      pageParam,
      limit: 5,
    },
    {
      enabled: inView && !isRefreshing,
      staleTime: 0,
      onSuccess: (newData) => {
        if (newData.items.length > 0) {
          setArticles(prev => [...prev, ...newData.items])
          setPageParam(newData.nextCursor)
        }
      },
    }
  )

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }, [refetch, isRefreshing])

  return {
    articles,
    setArticles,
    isLoading: isLoading || isRefreshing,
    ref,
    hasNextPage: data?.items.length === 5,
    refresh: handleRefresh
  }
}