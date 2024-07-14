require("@solana/wallet-adapter-react-ui/styles.css")
import "@/styles/globals.css"

import { Poppins } from "next/font/google"

import Providers from "./providers"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"
import RootLayout from "@/components/layout"

const font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${font.className}`}>
      <body>
        <Providers>
          <RootLayout>{children}</RootLayout>
        </Providers>
      </body>
    </html>
  )
}
