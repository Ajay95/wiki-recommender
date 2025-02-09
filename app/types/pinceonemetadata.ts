// app/types/pinceonemetadata.ts
import { RecordMetadata } from '@pinecone-database/pinecone'

export interface PineconeMetadata extends RecordMetadata {
  wiki_id: string;
  text: string;
  title: string;
  url: string;
}