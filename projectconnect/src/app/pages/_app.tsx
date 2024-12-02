import { SearchProvider } from "../context/SearchContext"; // Import your provider
import { AppProps } from "next/app"; // Import AppProps from next/app
import React from "react";
import "../styles/globals.css"; 
// MyApp function wraps your application with global components or providers
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Wrap the entire app with SearchProvider
    <SearchProvider>
      <Component {...pageProps} />
    </SearchProvider>
  );
}
