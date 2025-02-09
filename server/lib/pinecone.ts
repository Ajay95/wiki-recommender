import { Pinecone } from '@pinecone-database/pinecone'
import config from '../config'
import { WikiArticle } from '@/app/types'
import { getWikiImage } from './wiki'

export const initializePinecone = () => {
  return new Pinecone({
    apiKey: config.pinecone.apiKey,
  })
}

export const getPineconeIndex = () => {
  const pinecone = initializePinecone()
  return pinecone.Index(config.pinecone.index)
}

// Rest of your existing fetchRandomArticles function...

export async function fetchRandomArticles(limit: number = 10): Promise<WikiArticle[]> {
  try {
    const index = getPineconeIndex()
    const randomVector = Array(768).fill(0).map(() => Math.random() * 2 - 1);
    
    const queryResponse = await index.query({
      vector: randomVector,
      topK: limit,
      includeMetadata: true,
      filter: { hasImage: true } 
    });

    // Process first article immediately
    const firstArticle = queryResponse.matches[0];
    const firstProcessed = await processArticle(firstArticle);

    // Process rest lazily on event loop
    const restMatches = queryResponse.matches.slice(1);
    const restArticles: WikiArticle[] = [];
    
    for (const match of restMatches) {
      // Use setImmediate to yield to event loop between each article
      const article = await new Promise<WikiArticle>(resolve => {
        setImmediate(async () => {
          const processed = await processArticle(match);
          resolve(processed);
        });
      });
      restArticles.push(article);
    }

    return [firstProcessed, ...restArticles];
  } catch (error) {
    console.error('Error fetching random articles:', error);
    throw error;
  }
}

async function processArticle(match: any) {
  const wiki_id = parseInt(match.metadata?.wiki_id as string);
  const imageUrl = await getWikiImage(wiki_id);
  
  return {
    id: match.id,
    text: match.metadata?.text as string,
    title: match.metadata?.title as string,
    url: match.metadata?.url as string,
    wiki_id,
    imageUrl: imageUrl || undefined,
    vector: match.values as number[] // Add this line
  };
}