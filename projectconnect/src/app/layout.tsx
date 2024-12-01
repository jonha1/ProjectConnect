"use client"
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import './styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SearchProvider } from '../app/context/SearchContext'; // Import the provider
import React, { useEffect } from 'react';
import { Jockey_One } from 'next/font/google';

const jockeyOne = Jockey_One({
  subsets: ['latin'], // Specify the subset(s) you need
  weight: '400', // Specify the font weight
});

// export const metadata = {
//   title: 'ProjectConnect',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Dynamically load Bootstrap JavaScript
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import('bootstrap/dist/js/bootstrap.bundle.min.js' as any).catch((err) =>
      console.error('Failed to load Bootstrap JavaScript:', err)
    );
  }, []);

  return (
    <html lang="en">
      <head>
      </head>
      <body className={jockeyOne.className}>
        {/* Wrap the children in the SearchProvider */}
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
