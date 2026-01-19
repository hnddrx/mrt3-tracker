import { useState, useEffect } from 'react';
import { getTheme } from './theme/theme';
import useGPSTracking from './hooks/useGPSTracking';

import { MRT3_STATIONS } from './data/mrt3Stations';
import { LRT1_STATIONS } from './data/lrt1Station';
import { EDSA_CAROUSEL_STATIONS } from './data/edsaCarouselStation';

import Header from './components/Header';
import GPSStatusBar from './components/GPSStatusBar';
import  ShareLocationButton from './components/ShareLocationButton';
import Notification from './components/Notification';
import DestinationSelector from './components/DestinationSelector';
import CurrentStationCard from './components/CurrentStationCard';
import NextStationCard from './components/NextStationCard';
import RouteMap from './components/RouteMap';
import MobileMapToggle from './components/MobileMapToggle';

const LINES = {
  mrt3: { name: 'MRT-3', stations: MRT3_STATIONS, color: '#1e40af' },
  lrt1: { name: 'LRT-1', stations: LRT1_STATIONS, color: '#dc2626' },
  carousel: { name: 'CAROUSEL', stations: EDSA_CAROUSEL_STATIONS, color: '#16a34a' },
};

export default function TransitTracker() {
  const [lineKey, setLineKey] = useState('mrt3');
  const [destination, setDestination] = useState(null);
  const [notification, setNotification] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
  );

  const line = LINES[lineKey];

  const {
    userLocation,
    isTracking,
    gpsCurrentStation,
    gpsNextStation,
    gpsProgress,
    locationError,
  } = useGPSTracking(destination, line.stations);

  const theme = getTheme(isDarkMode);

  // Notifications
  useEffect(() => {
    if (isTracking && !gpsCurrentStation) setNotification('Acquiring GPS location...');
  }, [isTracking, gpsCurrentStation]);

  useEffect(() => {
    if (gpsCurrentStation) setNotification(`Arrived at ${gpsCurrentStation.name}`);
  }, [gpsCurrentStation]);

  // Dark mode listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-300 pt-28`}>
      {/* Fixed Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        userLocation={userLocation} 
        theme={theme}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* GPS & Notifications */}
        <GPSStatusBar isTracking={isTracking} userLocation={userLocation} theme={theme} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Line Selector */}
          <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
            {Object.keys(LINES).map((key) => {
              const isSelected = lineKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setLineKey(key)}
                  className={`
                    px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300
                    flex items-center justify-center
                    ${isSelected
                      ? 'text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:shadow-md hover:scale-105'}
                  `}
                  style={
                    isSelected
                      ? {
                          background: `linear-gradient(135deg, ${LINES[key].color} 0%, ${LINES[key].color}aa 100%)`,
                        }
                      : {}
                  }
                >
                  {LINES[key].name}
                </button>
              );
            })}
          </div>

        {/* Share Location */}
      
      </div>

        {notification && <Notification message={notification} theme={theme} />}
        {locationError && <Notification message={locationError} type="error" theme={theme} />}

        {/* Map Toggle for Mobile */}
        <MobileMapToggle onClick={() => setIsMapOpen(true)} theme={theme} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Destination & Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <DestinationSelector
              destination={destination}
              onDestinationChange={setDestination}
              stations={line.stations}
              theme={theme}
            />

            <CurrentStationCard
              currentStation={gpsCurrentStation}
              destination={destination}
              stations={line.stations}
              lineColor={line.color}
              theme={theme}
            />

            <NextStationCard
              nextStation={gpsNextStation}
              progress={gpsProgress}
              destination={destination}
              lineColor={line.color}
              theme={theme}
            />
          </div>

          {/* Right Column: Route Map */}
          <RouteMap
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            stations={line.stations}
            currentStation={gpsCurrentStation}
            destination={destination}
            direction={
              gpsCurrentStation && destination && gpsCurrentStation.id < destination.id
                ? 'Southbound'
                : 'Northbound'
            }
            theme={theme}
          />
        </div>
      </main>
    </div>
  );
}
