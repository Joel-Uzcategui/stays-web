export const safePath = (value: string | undefined, fallback: string) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
