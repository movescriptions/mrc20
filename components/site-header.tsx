'use client'

import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ConnectButton,
  ErrorCode,
} from '@suiet/wallet-kit'
import './ui/suiet-wallet-kit-custom.css'

export function SiteHeader() {
  return (
    <header>
      <div className="mx-8 flex h-16 items-center justify-start space-x-4">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <div className="flex items-center gap-x-5 md:gap-x-8">
            <ConnectButton
              label="Connect Wallet"
              onConnectError={(error) => {
                if (
                  error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED
                ) {
                  console.warn(
                    'user rejected the connection to ' + error.details?.wallet,
                  )
                } else {
                  console.warn('unknown connect error: ', error)
                }
              }}
            >Connect Wallet</ConnectButton>
          </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
