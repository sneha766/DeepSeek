import {Inter} from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppcontextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepSeek Clone",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppcontextProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Toaster toastOptions={
          {success : {style:{background:"black",color:"white"} },
          error : {style:{background:"black",color:"white"} }
        }
        }  />
        {children}
      </body>
    </html>
    </AppcontextProvider>
    </ClerkProvider>
  );
}
