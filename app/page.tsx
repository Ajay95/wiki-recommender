import { ArticleList } from './components/ArticleList'
import { getInitialArticles } from './actions/articles'

export default async function Home() {
  const initialArticle = await getInitialArticles()
  
  if (!initialArticle) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <ArticleList initialArticle={initialArticle} />
    </div>
  )
}