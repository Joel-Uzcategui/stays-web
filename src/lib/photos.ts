// The gateway streams the bytes; storage itself is not reachable from here.
// This URL is only ever handed to next/image, which fetches it from the Next
// server — so the internal address never reaches a browser.
export const photoUrl = (photoId: string) =>
  `${process.env.API_URL}/photos/${photoId}/file`;
