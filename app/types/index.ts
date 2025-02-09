export interface WikiArticle {
  id: string;
  text: string;
  title: string;
  url: string;
  wiki_id: number;
  imageUrl?: string;
  vector: number[];
}

export interface ArticlesResponse {
  items: WikiArticle[];
  nextCursor: number;
}