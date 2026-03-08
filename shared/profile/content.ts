import type { Locales } from "~~/shared/i18n/locale";

type ProfileCopy = {
  heading: string;
  belongings: string;
  graduate: string;
};

export const profileCopy: Record<Locales, ProfileCopy> = {
  ja: {
    heading: "Profile",
    belongings: "所属: CyberAgent, Inc.",
    graduate:
      "卒業: 東京都立産業技術大学院大学産業技術研究科産業技術専攻情報アーキテクチャコース, 明治大学総合数理学部現象数理学科",
  },
  en: {
    heading: "Profile",
    belongings: "Belongings: CyberAgent, Inc.",
    graduate:
      "Graduates: Advanced Institute of Industrial Technology, Tokyo., Bachelor of Science, MEIJI UNIVERSITY, Tokyo.",
  },
};

export const profileLinks = [
  {
    label: "bluesky: @jabelic.bsky.social",
    to: "https://bsky.app/profile/jabelic.bsky.social",
  },
  {
    label: "Twitter: @Jabelic_",
    to: "https://twitter.com/jabelic_",
  },
  {
    label: "GitHub: Jabelic",
    to: "https://github.com/jabelic",
  },
  {
    label: "Scrapbox: jabelic-public",
    to: "https://scrapbox.io/jabelic-public",
  },
] as const;
