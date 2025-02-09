import { ArticlePageData } from "./articlepagedata";

export interface InfiniteArticleData {
    pages: ArticlePageData[];
    pageParams: (number | undefined)[];
  }