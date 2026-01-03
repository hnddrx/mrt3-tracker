import { Radio } from 'lucide-react';

const GPSStatusBar = ({ isTracking, userLocation, theme }) => (
  <div className={`${theme.card} ${theme.cardBorder} border rounded-xl p-3 sm:p-4 shadow-sm mb-4`}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex-shrink-0">
          <Radio 
            className={isTracking ? 'text-green-500 animate-pulse' : 'text-slate-400'} 
            size={18}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs sm:text-sm truncate">GPS Status</p>
          <p className={`text-xs ${theme.textMuted}`}>
            {isTracking ? 'Tracking Active' : 'Inactive'}
          </p>
        </div>
      </div>
      
      {userLocation && (
        <div className="flex items-center gap-2 pl-7 sm:pl-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <p className="text-xs font-mono text-green-500 truncate">
            <span className="hidden md:inline">{userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}</span>
            <span className="md:hidden">{userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}</span>
          </p>
        </div>
      )}
    </div>
  </div>
);

export default GPSStatusBar;
