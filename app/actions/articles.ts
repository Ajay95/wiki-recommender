// app/actions/articles.ts
'use server'


import { getPineconeIndex } from '@/server/lib/pinecone'
import { getWikiImage } from '@/server/lib/wiki'
import { WikiArticle } from '../types'
import { PineconeMetadata } from '../types/pinceonemetadata'

const index = getPineconeIndex()

export async function refreshInitialArticle() {
  return getInitialArticles()
}



export async function getInitialArticles(): Promise<WikiArticle | null> {
  try {
    const randomVector = Array(768).fill(0).map(() => Math.random() * 2 - 1)

    const queryResponse = await index.query({
      vector: randomVector,
      topK: 5,
      includeMetadata: true,
      includeValues: true,
    })

    if (queryResponse.matches.length === 0) {
      return null
    }

    const match = queryResponse.matches[0]
    // Safe type assertion after validation
    const metadata = match.metadata as unknown as PineconeMetadata
    if (!metadata?.wiki_id) return null

    const wiki_id = parseInt(metadata.wiki_id)
    if (isNaN(wiki_id)) return null

    const imageUrl = await getWikiImage(wiki_id)

    return {
      id: match.id,
      text: metadata.text,
      title: metadata.title,
      url: metadata.url,
      wiki_id,
      imageUrl: imageUrl || undefined,
      vector: match.values as number[]
    }
  } catch (error) {
    console.error('Error fetching initial article:', error)
    return null
  }
}
