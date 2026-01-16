import { useEffect, useState } from 'react';
import { MRT3_STATIONS } from '../data/mrt3Stations';

const useGPSTracking = (destination) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [gpsCurrentStation, setGpsCurrentStation] = useState(null);
  const [gpsNextStation, setGpsNextStation] = useState(null);
  const [gpsProgress, setGpsProgress] = useState(0);

  console.log("useGPSTracking Hook Called with destination:", destination);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearestStation = (lat, lng) => {
    let nearest = null;
    let minDistance = Infinity;

    MRT3_STATIONS.forEach(station => {
      const distance = calculateDistance(lat, lng, station.lat, station.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return { station: nearest, distance: minDistance };
  };

  const determineNextStation = (currentStationId, destinationId) => {
    if (!currentStationId || !destinationId) return null;

    const currentIndex = MRT3_STATIONS.findIndex(s => s.id === currentStationId);
    const destIndex = MRT3_STATIONS.findIndex(s => s.id === destinationId);

    if (currentIndex === -1 || destIndex === -1) return null;
    
    // If already at destination
    if (currentIndex === destIndex) return null;

    // Determine direction and return next station
    if (currentIndex < destIndex) {
      // Moving forward in the array
      return MRT3_STATIONS[currentIndex + 1];
    } else {
      // Moving backward in the array
      return MRT3_STATIONS[currentIndex - 1];
    }
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('GPS Position Update:', position);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const { station, distance } = findNearestStation(latitude, longitude);
        console.log('Nearest Station Found:', station?.name, 'at distance:', distance.toFixed(2), 'km');
        
        // Update current station if within 0.5km
        if (distance < 0.5) {
          if (!gpsCurrentStation || gpsCurrentStation.id !== station.id) {
            console.log('Updating current station to:', station.name);
            setGpsCurrentStation(station);
          }
        }
        
        // Calculate progress between current and next station
        if (gpsCurrentStation && gpsNextStation) {
          const distToCurrent = calculateDistance(
            latitude, 
            longitude, 
            gpsCurrentStation.lat, 
            gpsCurrentStation.lng
          );
          const distToNext = calculateDistance(
            latitude, 
            longitude, 
            gpsNextStation.lat, 
            gpsNextStation.lng
          );
          const totalDist = calculateDistance(
            gpsCurrentStation.lat, 
            gpsCurrentStation.lng, 
            gpsNextStation.lat, 
            gpsNextStation.lng
          );
          
          // Progress is how far from current station relative to total distance
          const progressPercent = (distToCurrent / totalDist) * 100;
          setGpsProgress(Math.min(Math.max(progressPercent, 0), 100));
        }
        
        setLocationError('');
      },
      (error) => {
        console.error('GPS Error:', error);
        setLocationError(`GPS Error: ${error.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      console.log('Cleaning up GPS watch');
      navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsCurrentStation, gpsNextStation]);

  // Separate effect to update next station when current station or destination changes
  useEffect(() => {
    if (gpsCurrentStation && destination) {
      const nextStation = determineNextStation(gpsCurrentStation.id, destination.id);
      console.log('Next station determined:', nextStation?.name || 'None (at destination)');
      setGpsNextStation(nextStation);
      setGpsProgress(0); // Reset progress when stations change
    } else {
      setGpsNextStation(null);
      setGpsProgress(0);
    }
  }, [gpsCurrentStation, destination]);

  return {
    userLocation,
    locationError,
    isTracking,
    gpsCurrentStation,
    gpsNextStation,
    gpsProgress
  };
};

export default useGPSTracking;