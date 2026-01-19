import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import { X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({
  isOpen,
  onClose,
  stations = [],
  currentStation,
  destination,
  direction,
  theme
}) {
  const routePositions = stations.map(s => [s.lat, s.lng]);

  return (
    <aside
      className={`
        fixed lg:relative top-0 right-0 h-full
        w-full sm:w-96 lg:w-auto
        transform transition-transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      <div className={`${theme.card} ${theme.cardBorder} border p-4 h-full flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Route Map</h2>
          <button onClick={onClose} className="lg:hidden p-1">
            <X size={20} />
          </button>
        </div>

        <MapContainer
          center={stations[0] ? [stations[0].lat, stations[0].lng] : [14.5995, 120.9842]}
          zoom={13}
          scrollWheelZoom={true}
          className="flex-1 rounded-2xl shadow-md"
          style={{ height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Route Line */}
          {stations.length > 1 && <Polyline positions={routePositions} color="#1e40af" weight={4} />}

          {/* Station Markers */}
          {stations.map((station, index) => {
            // Determine label color
            let labelColor = '#6b7280'; // default subtle gray
            if (currentStation?.id === station.id) labelColor = '#3b82f6';   // blue
            else if (destination?.id === station.id) labelColor = '#22c55e'; // green
            else if (
              currentStation &&
              index === stations.findIndex(s => s.id === currentStation.id) + 1
            ) labelColor = '#f97316'; // orange (next)

            return (
              <CircleMarker
                key={station.id}
                center={[station.lat, station.lng]}
                radius={currentStation?.id === station.id ? 10 : 6}
                pathOptions={{
                  color: '#888',
                  fillColor: '#fff',
                  fillOpacity: 1,
                  weight: 2,
                }}
              >
                <Tooltip
                  permanent
                  direction="right"
                  offset={[12, 0]}
                  className="bg-white text-xs font-medium rounded-lg shadow px-2 py-1 opacity-90 whitespace-nowrap"
                  style={{ color: labelColor }}
                >
                  {station.name}
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </aside>
  );
}
