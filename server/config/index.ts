// server/config/index.ts
import { z } from 'zod'

const configSchema = z.object({
  pinecone: z.object({
    apiKey: z.string(),
    index: z.string(),
    host: z.string(),
  }),
  openRouter: z.object({
    apiKey: z.string(),
    siteUrl: z.string(),
    siteName: z.string(),
  }),
})

const config = {
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    index: process.env.PINECONE_INDEX,
    host: process.env.PINECONE_HOST,
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    siteUrl: process.env.SITE_URL,
    siteName: process.env.SITE_NAME,
  },
}

export default configSchema.parse(config)