interface InteractionWithEmbedding {
    articleId: string;
    type: 'like' | 'dislike' | 'view';
    score: number;
    vector: number[]; // 768-dimension vector
    timestamp: number;
  }
  