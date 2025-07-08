import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PhoneProvider } from "../contexts/PhoneContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PhoneProvider>
          {children}
          <ToastContainer />
        </PhoneProvider>
      </body>
    </html>
  );
}
