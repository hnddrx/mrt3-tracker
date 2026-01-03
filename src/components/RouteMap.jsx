import { X } from 'lucide-react';
import { MRT3_STATIONS } from '../data/mrt3Stations';
import RouteStationItem from './RouteStationItem';

export default function RouteMap({
  isOpen,
  onClose,
  currentStation,
  destination,
  direction,
  theme
}) {
  return (
    <aside
      className={`
        fixed lg:relative top-0 right-0 h-full
        w-full sm:w-96 lg:w-auto
        transform transition-transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      <div className={`${theme.card} ${theme.cardBorder} border p-6 h-full overflow-y-auto`}>
        <div className="flex justify-between mb-6">
          <h2 className="font-bold">Route Map</h2>
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {MRT3_STATIONS.map((station, index) => (
          <RouteStationItem
            key={station.id}
            station={station}
            index={index}
            currentStation={currentStation}
            destination={destination}
            direction={direction}
            isLast={index === MRT3_STATIONS.length - 1}
            theme={theme}
          />
        ))}
      </div>
    </aside>
  );
}
