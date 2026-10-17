export const today = () => new Date().toISOString().slice(0, 10);

export const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
};

export const isDay = (value?: string): value is string =>
  value !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(value);
