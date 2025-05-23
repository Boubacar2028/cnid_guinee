import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Résoudre le problème des icônes manquantes dans Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapView = ({ centers, selectedCenterId, onCenterClick }) => {
  const [mapType, setMapType] = useState('streets');
  
  // Définir la position centrale de Conakry
  const conakryCenter = [9.5092, -13.7122];
  const defaultZoom = 12;
  
  // Centre actuellement sélectionné
  const selectedCenter = centers.find(c => c.id === selectedCenterId);
  
  // Fonction pour générer un lien d'itinéraire vers le centre sélectionné
  const getDirectionsUrl = (center) => {
    if (!center || !center.position) return "#";
    return `https://www.google.com/maps/dir/?api=1&destination=${center.position[0]},${center.position[1]}&travelmode=driving`;
  };

  // Créer un marqueur pour chaque centre
  const markers = centers.map(center => {
    if (!center.position) return null; // Ignorer les centres sans position
    
    const isSelected = center.id === selectedCenterId;
    
    // Créer une icône personnalisée pour le marqueur sélectionné
    const markerIcon = isSelected 
      ? new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [30, 45],
          iconAnchor: [15, 45],
          popupAnchor: [0, -45],
          className: 'selected-marker',
        })
      : new L.Icon.Default();

    return (
      <Marker 
        key={center.id} 
        position={center.position}
        icon={markerIcon}
        eventHandlers={{
          click: () => onCenterClick && onCenterClick(center.id)
        }}
      >
        <Popup>
          <div>
            <h3 className="font-medium text-base">{center.name}</h3>
            <p className="text-sm text-gray-600">{center.address}</p>
          </div>
        </Popup>
      </Marker>
    );
  }).filter(Boolean); // Filtrer les marqueurs null

  return (
    <div className="w-full h-full flex flex-col">
      {/* Contrôles de la carte */}
      <div className="bg-white p-3 rounded-t-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={() => setMapType('streets')} 
            className={`px-3 py-1 rounded ${mapType === 'streets' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Rue
          </button>
          <button 
            onClick={() => setMapType('satellite')} 
            className={`px-3 py-1 rounded ${mapType === 'satellite' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Satellite
          </button>
        </div>
        {selectedCenter && (
          <a 
            href={getDirectionsUrl(selectedCenter)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Itinéraire</span>
          </a>
        )}
      </div>
      
      {/* Carte */}
      <div className="flex-grow">
        <MapContainer 
          center={conakryCenter} 
          zoom={defaultZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked={mapType === 'streets'} name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked={mapType === 'satellite'} name="Satellite">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {markers}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;