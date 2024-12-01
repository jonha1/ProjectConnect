import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* No custom font link here for app directory */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
