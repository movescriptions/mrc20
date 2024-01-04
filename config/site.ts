export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "MRC20",
  description:
    "We provide MRC20 smart inscription mint service.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Marketplace(coming soon)",
      href: "/",
    },
    {
      title: "My Assets",
      href: "/assets",
    },
  ],
  links: {
    twitter: "https://twitter.com/MoveScriptions",
    github: "https://github.com/movescriptions/movescriptions",
    docs: "",
  },
}

export const PACKAGE_ID = '0xebbba763f5fc01d90c2791c03536a373791b634600e81d4e08b85f275f1274fa'
export const DEPLOY_RECORD = '0x8fb949a8ae112ee025401cdb6dcdcfe04a8817bc2912a778a875e6b3697715da'
export const NETWORK = 'mainnet'