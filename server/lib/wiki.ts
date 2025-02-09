// server/lib/wiki.ts
export async function getWikiImage(pageId: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pithumbsize=1200&pageids=${pageId}&origin=*`,
      { 
        next: { revalidate: 86400 },
        priority: 'high' // Prioritize these requests
      }
    )
    const data = await response.json()
    const page = data.query?.pages?.[pageId]
    return page?.original?.source || null
  } catch (error) {
    console.error('Error fetching wiki image:', error)
    return null
  }
}