import { MapPin } from 'lucide-react';

const CurrentStationCard = ({ currentStation, destination, stationsRemaining, direction, theme }) => (
  <section className={`${theme.card} ${theme.cardBorder} border rounded-2xl p-6 shadow-sm`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-500/10 p-2 rounded-lg">
        <MapPin className="text-blue-500" size={24} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-wide">Current Station</h2>
        {destination && (
          <p className={`text-xs ${theme.textMuted} mt-0.5`}>
            {direction} • {stationsRemaining} stop{stationsRemaining !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>
    </div>
    <h3 className="text-4xl sm:text-5xl font-bold mb-2">
      {currentStation?.name || 'Waiting for GPS...'}
    </h3>
  </section>
);
export default CurrentStationCard;
