export default function linkToName(twitterUrl: string) {
  if (twitterUrl.startsWith("https://x.com/")) {
    return twitterUrl.slice(14);
  } else if (twitterUrl.startsWith("x.com/")) {
    return twitterUrl.slice(6);
  } else if (twitterUrl.startsWith("https://twitter.com/")) {
    return twitterUrl.slice(20);
  } else if (twitterUrl.startsWith("twitter.com/")) {
    return twitterUrl.slice(12);
  }
}
