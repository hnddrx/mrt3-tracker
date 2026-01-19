export default function RouteStationItem({
  station,
  index,
  stations = [],          // <-- full stations array passed from RouteMap
  currentStation,
  destination,
  direction,
  isLast,
  theme
}) {
  const isCurrent = currentStation?.id === station.id;
  const isDestination = destination?.id === station.id;

  const currentIndex = stations.findIndex(s => s.id === currentStation?.id);
  const destIndex = stations.findIndex(s => s.id === destination?.id);

  const isOnRoute =
    currentStation &&
    destination &&
    ((direction === 'Southbound' && index >= currentIndex && index <= destIndex) ||
     (direction === 'Northbound' && index <= currentIndex && index >= destIndex));

  return (
    <div className="flex gap-3 py-2">
      <div className="flex flex-col items-center">
        <div
          className={`
            w-4 h-4 rounded-full border-2
            ${isCurrent ? 'bg-blue-500 border-blue-500' : ''}
            ${isDestination ? 'bg-purple-500 border-purple-500' : ''}
            ${!isCurrent && !isDestination && isOnRoute ? theme.routeLine : ''}
            ${!isCurrent && !isDestination && !isOnRoute ? theme.stationBorder : ''}
          `}
        />
        {!isLast && (
          <div
            className={`w-0.5 h-8 ${
              isOnRoute ? theme.routeLine : theme.routeLineInactive
            }`}
          />
        )}
      </div>

      <div
        className={`
          flex-1
          ${isCurrent ? 'font-bold text-blue-500' : ''}
          ${isDestination ? 'font-semibold text-purple-500' : ''}
          ${!isCurrent && !isDestination ? theme.textMuted : ''}
        `}
      >
        <p>{station.name}</p>
        {isCurrent && <span className="text-xs">You are here</span>}
        {isDestination && <span className="text-xs">Your destination</span>}
      </div>
    </div>
  );
}
