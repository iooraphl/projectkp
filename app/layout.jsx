import "../src/styles.css";
import "../src/styles/auth.css";
import "../src/styles/admin.css";
import "../src/styles/profile.css";
import { AuthProvider } from "../src/contexts/AuthContext";

export const metadata = {
  title: "Surya Ban",
  description: "Katalog ban mobil dan pemesanan manual untuk Surya Ban"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
