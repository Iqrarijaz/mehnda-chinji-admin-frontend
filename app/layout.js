import "../styles/globals.scss";
import 'react-toastify/dist/ReactToastify.css';
import ClientProviders from "@/components/providers/ClientProviders";
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: "Rehbar Admin Panel",
  description: "Rehbar App Administration Control Center",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientProviders>
          <NextTopLoader
            color="#ffffffff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={false}
            zIndex={2000000}
            easing="ease"
            speed={200}
            shadow="0 0 10px #006666, 0 0 5px #006666"
          />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}