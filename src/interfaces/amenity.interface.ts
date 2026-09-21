export const AMENITY_SCOPES = ['hotel', 'room', 'both'] as const;

export type AmenityScope = (typeof AMENITY_SCOPES)[number];

export interface Amenity {
  id: string;
  code: string;
  name: string;
  scope: AmenityScope;
  active: boolean;
}
