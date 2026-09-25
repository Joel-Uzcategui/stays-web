'use client';

import { Map, Marker, NavigationControl } from '@vis.gl/react-maplibre';
import { MapPin } from 'lucide-react';

import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

interface Props {
  latitude: number;
  longitude: number;
  label?: string;
  zoom?: number;
}

export const StaticMap = ({ latitude, longitude, label, zoom = 14 }: Props) => {
  return (
    <div className="h-64 overflow-hidden rounded border border-line">
      <Map
        initialViewState={{ latitude, longitude, zoom }}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Marker latitude={latitude} longitude={longitude} anchor="bottom">
          <MapPin
            size={30}
            strokeWidth={1.5}
            aria-label={label}
            className="fill-accent-soft text-accent-deep"
          />
        </Marker>
      </Map>
    </div>
  );
};
