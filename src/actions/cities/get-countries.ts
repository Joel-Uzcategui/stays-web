'use server';

export const getCountries = async (): Promise<string[]> => {
  const response = await fetch(`${process.env.API_URL}/cities/countries`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Could not load countries: ${response.status}`);
  }

  return response.json();
};
