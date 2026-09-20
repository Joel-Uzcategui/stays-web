export interface Hotel {
  id: string;
  name: string;
  description: string | null;
  country: string;
  city: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
