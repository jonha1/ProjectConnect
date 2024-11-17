import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import './styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SearchProvider } from '../app/context/SearchContext'; // Import the provider
import React from 'react';

export const metadata = {
  title: 'ProjectConnect',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Jockey+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Wrap the children in the SearchProvider */}
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}

