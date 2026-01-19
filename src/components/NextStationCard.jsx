import { Navigation } from 'lucide-react';

const NextStationCard = ({ nextStation, progress = 0, destination, lineColor = '#1e40af', theme }) => {
  // Show nextStation if available, otherwise fallback to destination
  const displayStation = nextStation?.name || destination?.name || 'Select destination';
  const displayProgress = nextStation ? progress : 0;

  return (
    <section className={`${theme.card} ${theme.cardBorder} border rounded-2xl p-6 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${lineColor}20` }}>
          <Navigation size={24} style={{ color: lineColor }} />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: lineColor }}>
          Next Station
        </h2>
      </div>

      <h3 className="text-3xl sm:text-4xl font-bold mb-4">{displayStation}</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${theme.textMuted}`}>Progress</span>
          <span className="text-sm font-bold" style={{ color: lineColor }}>
            {Math.round(displayProgress)}%
          </span>
        </div>

        <div className={`w-full ${theme.progressBg} rounded-full h-2 overflow-hidden`}>
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${displayProgress}%`,
              background: `linear-gradient(to right, ${lineColor}, #0000ff)` // gradient matches line
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default NextStationCard;
