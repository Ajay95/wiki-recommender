import '../globals.css'  // Add this import
import { Providers } from './providers';

export const metadata = {  // Add metadata
  title: 'WikiTok',
  description: 'Wiki article recommendations in TikTok style',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}