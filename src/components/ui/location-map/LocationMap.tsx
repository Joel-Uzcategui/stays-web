'use client';

import { Map, Marker, NavigationControl } from '@vis.gl/react-maplibre';
import { MapPin } from 'lucide-react';

import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const WORLD_VIEW = { longitude: -3.7038, latitude: 40.4168, zoom: 3.5 };
const PIN_ZOOM = 15;

export interface Coords {
  latitude: number;
  longitude: number;
}

interface Props {
  coords: Coords | null;
  onPick: (coords: Coords) => void;
}

export const LocationMap = ({ coords, onPick }: Props) => {
  return (
    <div className="h-72 overflow-hidden rounded border border-line">
      <Map
        initialViewState={coords ? { ...coords, zoom: PIN_ZOOM } : WORLD_VIEW}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onClick={({ lngLat }) =>
          onPick({ latitude: lngLat.lat, longitude: lngLat.lng })
        }
      >
        <NavigationControl position="top-right" showCompass={false} />

        {coords && (
          <Marker
            latitude={coords.latitude}
            longitude={coords.longitude}
            anchor="bottom"
            draggable
            onDragEnd={({ lngLat }) =>
              onPick({ latitude: lngLat.lat, longitude: lngLat.lng })
            }
          >
            <MapPin
              size={30}
              strokeWidth={1.5}
              className="cursor-grab fill-accent-soft text-accent-deep active:cursor-grabbing"
            />
          </Marker>
        )}
      </Map>
    </div>
  );
};
