export interface ContentItem {
  title: string;
  kind: string;
  /** Icon key: youtube, waves, code, book, users or mic. */
  icon: string;
  description: string;
  tagline?: string;
  url?: string;
  linkLabel?: string;
}
