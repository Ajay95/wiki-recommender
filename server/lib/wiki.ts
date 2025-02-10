// server/lib/wiki.ts
export async function getWikiImage(wiki_id: number) {
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids=${wiki_id}`);
    const data = await response.json();
    const imageUrl = data?.query?.pages?.[wiki_id]?.original?.source;
    console.log('Wiki image URL:', imageUrl); // Add this log
    return imageUrl;
  } catch (error) {
    console.error('Error fetching wiki image:', error);
    return null;
  }
}