import { WikiArticle } from ".";


export interface ArticlePageData {
    items: WikiArticle[];
    nextCursor: number | null;
  }