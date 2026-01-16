import { useEffect, useState, useCallback } from 'react';
import { MRT3_STATIONS } from '../data/mrt3Stations';

const useGPSTracking = (destination) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [gpsCurrentStation, setGpsCurrentStation] = useState(null);
  const [gpsNextStation, setGpsNextStation] = useState(null);
  const [gpsProgress, setGpsProgress] = useState(0);

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const findNearestStation = useCallback((lat, lng) => {
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
  }, [calculateDistance]);

  const determineNextStation = useCallback((currentStationId, destinationId) => {
    if (!currentStationId || !destinationId) return null;

    const currentIndex = MRT3_STATIONS.findIndex(s => s.id === currentStationId);
    const destIndex = MRT3_STATIONS.findIndex(s => s.id === destinationId);

    if (currentIndex === -1 || destIndex === -1) return null;
    if (currentIndex === destIndex) return null;

    if (currentIndex < destIndex) {
      return MRT3_STATIONS[currentIndex + 1];
    } else {
      return MRT3_STATIONS[currentIndex - 1];
    }
  }, []);

  // Update next station when current station or destination changes
  useEffect(() => {
    if (gpsCurrentStation && destination) {
      const nextStation = determineNextStation(gpsCurrentStation.id, destination.id);
      setGpsNextStation(nextStation);
      setGpsProgress(0);
    } else {
      setGpsNextStation(null);
      setGpsProgress(0);
    }
  }, [gpsCurrentStation, destination, determineNextStation]);

  // GPS tracking effect
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const { station, distance } = findNearestStation(latitude, longitude);
        
        // Update current station if within 0.5km
        if (distance < 0.5) {
          setGpsCurrentStation(prevStation => {
            if (!prevStation || prevStation.id !== station.id) {
              return station;
            }
            return prevStation;
          });
        }
        
        // Calculate progress between current and next station
        setGpsProgress(prevProgress => {
          if (gpsCurrentStation && gpsNextStation) {
            const distToCurrent = calculateDistance(
              latitude, 
              longitude, 
              gpsCurrentStation.lat, 
              gpsCurrentStation.lng
            );
            const totalDist = calculateDistance(
              gpsCurrentStation.lat, 
              gpsCurrentStation.lng, 
              gpsNextStation.lat, 
              gpsNextStation.lng
            );
            
            const progressPercent = (distToCurrent / totalDist) * 100;
            return Math.min(Math.max(progressPercent, 0), 100);
          }
          return prevProgress;
        });
        
        setLocationError('');
      },
      (error) => {
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
      navigator.geolocation.clearWatch(watchId);
    };
  }, [findNearestStation, calculateDistance, gpsCurrentStation, gpsNextStation]);

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