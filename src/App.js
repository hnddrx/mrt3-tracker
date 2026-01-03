import { useState, useEffect } from 'react';
import { getTheme } from './theme/theme';
import useGPSTracking from './hooks/useGPSTracking';

import Header from './components/Header';
import GPSStatusBar from './components/GPSStatusBar';
import Notification from './components/Notification';
import DestinationSelector from './components/DestinationSelector';
import CurrentStationCard from './components/CurrentStationCard';
import NextStationCard from './components/NextStationCard';
import RouteMap from './components/RouteMap';
import MobileMapToggle from './components/MobileMapToggle';

export default function MRT3Tracker() {
  const [destination, setDestination] = useState(null);
  const [notification, setNotification] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const {
    userLocation,
    isTracking,
    gpsCurrentStation,
    gpsNextStation,
    gpsProgress,
    locationError
  } = useGPSTracking(destination);

  const theme = getTheme(isDarkMode);

  // --- NEW: show "Acquiring GPS location..." while waiting for first station
  useEffect(() => {
    if (isTracking && !gpsCurrentStation) {
      setNotification('Acquiring GPS location...');
    }
  }, [isTracking, gpsCurrentStation]);

  // Existing: show notification when arriving at a station
  useEffect(() => {
    if (gpsCurrentStation) {
      setNotification(`Arrived at ${gpsCurrentStation.name}`);
    }
  }, [gpsCurrentStation]);

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <div className="max-w-7xl mx-auto p-6">

        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          theme={theme}
        />

        <GPSStatusBar
          isTracking={isTracking}
          userLocation={userLocation}
          theme={theme}
        />

        {notification && <Notification message={notification} theme={theme} />}
        {locationError && <Notification message={locationError} type="error" theme={theme} />}

        <MobileMapToggle onClick={() => setIsMapOpen(true)} theme={theme} />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <DestinationSelector
              destination={destination}
              onDestinationChange={setDestination}
              theme={theme}
            />

            <CurrentStationCard
              currentStation={gpsCurrentStation}
              destination={destination}
              stationsRemaining={0}
              direction=""
              theme={theme}
            />

            <NextStationCard
              nextStation={gpsNextStation}
              progress={gpsProgress}
              theme={theme}
            />
          </div>

          <RouteMap
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            currentStation={gpsCurrentStation}
            destination={destination}
            direction=""
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
