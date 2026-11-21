// Firebase serves directory pages with a trailing slash. Keep the browser
// address and crawlable links on that same URL, including deep links.
export function withPageSlash(url: string): string {
  return url.replace(/^(\/(?!\/)[^?#]*[^/?#])(?=[?#]|$)/, '$1/');
}
