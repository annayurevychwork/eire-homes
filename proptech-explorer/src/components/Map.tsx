import React from 'react';
import MapboxMap, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Property } from '../types';
import { Home } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Props {
  properties: Property[];
}

export const Map: React.FC<Props> = ({ properties }) => {
  const [popupInfo, setPopupInfo] = React.useState<Property | null>(null);

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-md border sticky top-6">
      <MapboxMap
        initialViewState={{
          longitude: -6.2603,
          latitude: 53.3498,
          zoom: 11
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.longitude}
            latitude={property.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(property);
            }}
          >
            <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transform hover:scale-110 transition-all">
              <Home size={20} />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            className="rounded-xl"
          >
            <div className="p-2 w-48">
              <img src={popupInfo.images[0]} alt={popupInfo.title} className="w-full h-24 object-cover rounded-md mb-2" />
              <h4 className="font-bold">€{popupInfo.price.toLocaleString()}</h4>
              <p className="text-xs text-gray-600 truncate">{popupInfo.title}</p>
            </div>
          </Popup>
        )}
      </MapboxMap>
    </div>
  );
};