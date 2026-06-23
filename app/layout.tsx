import type { Metadata } from "next"
import "./globals.css"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Brejão Arena",
  description: "Sistema de gestão da Brejão Arena",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
