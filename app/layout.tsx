import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";

const fontRoboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Taho - A food marketplace app",
  description: "A food marketplace app where you post homemade foods and buy stuffs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` ${fontRoboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div>{children}</div>
        </body>
    </html>
  );
}
