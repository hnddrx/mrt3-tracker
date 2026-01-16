import { Navigation } from 'lucide-react';

const NextStationCard = ({ nextStation, progress, theme }) => (
  <>
  
  <section className={`${theme.card} ${theme.cardBorder} border rounded-2xl p-6 shadow-sm`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-emerald-500/10 p-2 rounded-lg">
        <Navigation className="text-emerald-500" size={24} />
      </div>
      <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-wide">Next Station</h2>
    </div>
    <h3 className="text-3xl sm:text-4xl font-bold mb-4">
      {nextStation?.name || 'Select destination'}
    </h3>
    
    {nextStation && (
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${theme.textMuted}`}>Progress</span>
          <span className="text-sm font-bold text-emerald-500">{Math.round(progress)}%</span>
        </div>
        <div className={`w-full ${theme.progressBg} rounded-full h-2 overflow-hidden`}>
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )}
  </section>
  </>
);
export default NextStationCard;