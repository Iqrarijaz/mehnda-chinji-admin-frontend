import "../styles/globals.scss";
import 'react-toastify/dist/ReactToastify.css';
import ClientProviders from "@/components/providers/ClientProviders";

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
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}