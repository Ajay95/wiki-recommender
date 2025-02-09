import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { getPineconeIndex } from '../lib/pinecone'
import { WikiArticle } from '@/app/types'
import { getWikiImage } from '../lib/wiki'
import { PineconeMetadata } from '@/app/types/pinceonemetadata'

const index = getPineconeIndex()

export const appRouter = router({
  getArticles: publicProcedure
    .input(
      z.object({
        pageParam: z.number().optional(),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const vector = Array(768).fill(0).map(() => Math.random() * 2 - 1)
        
        const queryResponse = await index.query({
          vector,
          topK: input.limit,
          includeMetadata: true,
          includeValues: true,
        })

        const articles = await Promise.all(
          queryResponse.matches.map(async (match) => {
            try {
              const metadata = match.metadata as unknown as PineconeMetadata
              if (!metadata?.wiki_id) return null
              
              const wiki_id = parseInt(metadata.wiki_id)
              if (isNaN(wiki_id)) return null

              const imageUrl = await getWikiImage(wiki_id)
              if (!imageUrl) return null

              return {
                id: match.id,
                text: metadata.text,
                title: metadata.title,
                url: metadata.url,
                wiki_id,
                imageUrl,
                vector: match.values as number[]
              } as WikiArticle
            } catch (error) {
              console.error('Error processing article:', error)
              return null
            }
          })
        )

        const filteredArticles = articles
          .filter((a): a is WikiArticle => a !== null)
          .slice(0, input.limit)

        return {
          items: filteredArticles,
          nextCursor: (input.pageParam || 0) + input.limit,
        }
      } catch (error) {
        console.error('Error in getArticles query:', error)
        throw error
      }
    })
})

export type AppRouter = typeof appRouter