import "./globals.css";
import Header from "./components/Header/Header";
import localFont from 'next/font/local'
import Script from 'next/script'
import Footer from "./components/Footer/Footer";
import AOSInit from "./components/AOSInit";

const myCustomFont = localFont({
  src: [
    {
      path: './fonts/BeVietnamPro-Variable.woff2',
      variable: '--font-custom',
    }
  ],
})

export const metadata = {
  title: "Rela Hospital - Best Multispecialty Hospital in Chennai",
  description: "Rela Institute is the best multispecialty hospital in Chennai. We deliver high quality medical treatment with expert doctors. Your path to a healthier life starts here.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myCustomFont.className} >
<head>
<link rel="stylesheet" href="https://use.typekit.net/oat3iao.css"/>
</head>
      <body>
        <AOSInit/>

        <div
          className="gtranslate_wrapper"
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        />
        <Script id="gtranslate-init" strategy="afterInteractive">
          {`
            window.gtranslateSettings = window.gtranslateSettings || {
              default_language: 'en',
              languages: ['en', 'ta', 'hi', 'te', 'bn', 'ar'],
              wrapper_selector: '.gtranslate_wrapper'
            };
            if (!document.getElementById('gtranslate-widget-script')) {
              var s = document.createElement('script');
              s.id = 'gtranslate-widget-script';
              s.src = 'https://cdn.gtranslate.net/widgets/latest/dwf.js';
              s.defer = true;
              document.body.appendChild(s);
            }
          `}
        </Script>
        <Header/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
