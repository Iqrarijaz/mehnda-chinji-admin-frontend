import MenuContextProvider from "@/context/MenuContext";
import "../styles/globals.scss";
import MainLayout from "@/components/layout/MainLayout";
export const metadata = {
  title: "Admin Panel",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MenuContextProvider>
          <MainLayout>{children}</MainLayout>
        </MenuContextProvider>
      </body>
    </html>
  );
}
