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
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  console.log('Current pageParam:', pageParam)
  console.log('Current articles:', articles)

  const { data, isLoading, refetch } = trpc.getArticles.useQuery(
    {
      pageParam,
      limit: 5,
    },
    {
      enabled: inView,
      onSuccess: (newData) => {
        console.log('tRPC query success. New data:', newData)
        if (newData.items.length > 0) {
          // Always append new articles to maintain history
          console.log('Appending new articles')
          setArticles(prev => [...prev, ...newData.items])
          setPageParam(newData.nextCursor)
        }
      },
      onError: (error) => {
        console.error('tRPC query error:', error)
      }
    }
  )

  // Manual refresh handler - only called explicitly
  const handleRefresh = useCallback(async () => {
    console.log('Manual refresh triggered')
    try {
      const response = await refetch()
      console.log('Manual refresh complete:', response)
    } catch (error) {
      console.error('Manual refresh error:', error)
    }
  }, [refetch])

  return {
    articles,
    isLoading,
    ref,
    hasNextPage: data?.items.length === 5,
    refresh: handleRefresh
  }
}