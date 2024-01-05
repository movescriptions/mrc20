import "@/styles/globals.css"
import {Metadata} from "next"

import {siteConfig} from "@/config/site"
import {fontSans} from "@/lib/fonts"
import {cn} from "@/lib/utils"
import {SiteHeader} from "@/components/site-header"
import {TailwindIndicator} from "@/components/tailwind-indicator"
import {ThemeProvider} from "@/components/theme-provider"
import '@suiet/wallet-kit/style.css'
import Providers from '@/app/providers'
import Logos from "@/components/logos"
import Footer from "@/components/footer"
import {Alert, AlertDescription, AlertTitle,} from "@/components/ui/alert"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "white"},
    {media: "(prefers-color-scheme: dark)", color: "black"},
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
      <head/>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Providers>
          <div className="relative flex min-h-screen flex-col justify-center">
            <div className="flex justify-center">
              <Alert variant="destructive" className="w-800 m-4">
                <AlertTitle>Please note:</AlertTitle>
                <AlertDescription>
                      As the ecosystem of MRC20 grows, we decide to deprecate this site in the near future.
                      <br />
                      Please use another community site <a href="https://mrc20.app">https://mrc20.app</a> instead.
                </AlertDescription>
              </Alert>
            </div>
            <div className="MContainer">
              <SiteHeader/>
            </div>
            <div className="flex-1">{children}</div>
            <Logos/>
            <Footer/>
          </div>
          <TailwindIndicator/>
        </Providers>
      </ThemeProvider>
      </body>
      </html>
    </>
  )
}
