'use client';
import { trpc } from './_trpc/client';

export default function Home() {
  const hello = trpc.hello.useQuery();
  
  if (hello.isLoading) return <div>Loading...</div>;
  if (hello.error) return <div>Error: {hello.error.message}</div>;
  
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl">{hello.data}</h1>
    </main>
  );
}