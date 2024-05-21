import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html className="scroll-smooth">
      <Head />
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BND311EG8K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BND311EG8K');`}
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
