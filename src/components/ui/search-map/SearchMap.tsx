'use client';

import { useMemo } from 'react';
import { Layer, Map, Marker, NavigationControl, Source } from '@vis.gl/react-maplibre';
import { MapPin } from 'lucide-react';

import 'maplibre-gl/dist/maplibre-gl.css';

import type { SearchHotel } from '@/interfaces';

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const WORLD_VIEW = { longitude: 2.3522, latitude: 46.5, zoom: 3.4 };
const CIRCLE_STEPS = 64;

export interface Point {
  lat: number;
  lon: number;
}

interface Props {
  point: Point | null;
  radiusKm: number;
  hotels: SearchHotel[];
  onPick: (point: Point) => void;
}

const circle = (center: Point, radiusKm: number) => {
  const latRadius = radiusKm / 110.574;
  const lonRadius = radiusKm / (111.32 * Math.cos((center.lat * Math.PI) / 180));

  const ring = Array.from({ length: CIRCLE_STEPS + 1 }, (_, index) => {
    const angle = (index / CIRCLE_STEPS) * 2 * Math.PI;

    return [
      center.lon + lonRadius * Math.cos(angle),
      center.lat + latRadius * Math.sin(angle),
    ];
  });

  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [ring] },
    properties: {},
  };
};

export const SearchMap = ({ point, radiusKm, hotels, onPick }: Props) => {
  const area = useMemo(
    () => (point ? circle(point, radiusKm) : null),
    [point, radiusKm],
  );

  return (
    <div className="h-80 overflow-hidden rounded border border-line">
      <Map
        initialViewState={
          point ? { longitude: point.lon, latitude: point.lat, zoom: 11 } : WORLD_VIEW
        }
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onClick={({ lngLat }) => onPick({ lat: lngLat.lat, lon: lngLat.lng })}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {area && (
          <Source id="radius" type="geojson" data={area}>
            <Layer
              id="radius-fill"
              type="fill"
              paint={{ 'fill-color': '#2563eb', 'fill-opacity': 0.08 }}
            />
            <Layer
              id="radius-line"
              type="line"
              paint={{ 'line-color': '#2563eb', 'line-width': 1.5 }}
            />
          </Source>
        )}

        {hotels.map(
          (hotel) =>
            hotel.location && (
              <Marker
                key={hotel.id}
                latitude={hotel.location.lat}
                longitude={hotel.location.lon}
                anchor="bottom"
              >
                <span
                  title={hotel.name}
                  className="block size-2.5 rounded-full border-2 border-white bg-accent-deep shadow"
                />
              </Marker>
            ),
        )}

        {point && (
          <Marker
            latitude={point.lat}
            longitude={point.lon}
            anchor="bottom"
            draggable
            onDragEnd={({ lngLat }) =>
              onPick({ lat: lngLat.lat, lon: lngLat.lng })
            }
          >
            <MapPin
              size={28}
              strokeWidth={1.5}
              className="cursor-grab fill-accent-soft text-accent-deep active:cursor-grabbing"
            />
          </Marker>
        )}
      </Map>
    </div>
  );
};
