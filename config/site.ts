const DEFAULT_SITE_URL = "https://honeyb.money";

const normalizedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? DEFAULT_SITE_URL;

export const siteConfig = {
  name: "HoneyB",
  url: normalizedSiteUrl,
  description: "Put your Bitcoin to work",
  author: {
    twitter: "@honeyb",
  },
} as const;
