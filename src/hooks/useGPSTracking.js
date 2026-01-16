import { useEffect, useState, useCallback, useRef } from 'react';
import { MRT3_STATIONS } from '../data/mrt3Stations';

const useGPSTracking = (destination) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [gpsCurrentStation, setGpsCurrentStation] = useState(null);
  const [gpsNextStation, setGpsNextStation] = useState(null);
  const [gpsProgress, setGpsProgress] = useState(0);

  const gpsCurrentStationRef = useRef(null);
  const gpsNextStationRef = useRef(null);

  // Keep refs in sync
  useEffect(() => {
    gpsCurrentStationRef.current = gpsCurrentStation;
  }, [gpsCurrentStation]);

  useEffect(() => {
    gpsNextStationRef.current = gpsNextStation;
  }, [gpsNextStation]);

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
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported');
      return;
    }

    setIsTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const { station, distance } = findNearestStation(latitude, longitude);
        
        // Update current station if within 0.5km and different from current
        if (distance < 0.5) {
          setGpsCurrentStation(prev => {
            if (!prev || prev.id !== station.id) {
              return station;
            }
            return prev;
          });
        }
        
        // Calculate progress using refs to avoid dependency issues
        const currentStation = gpsCurrentStationRef.current;
        const nextStation = gpsNextStationRef.current;
        
        if (currentStation && nextStation) {
          const distToCurrent = calculateDistance(
            latitude, 
            longitude, 
            currentStation.lat, 
            currentStation.lng
          );
          const totalDist = calculateDistance(
            currentStation.lat, 
            currentStation.lng, 
            nextStation.lat, 
            nextStation.lng
          );
          
          const progressPercent = (distToCurrent / totalDist) * 100;
          setGpsProgress(Math.min(Math.max(progressPercent, 0), 100));
        }
        
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
  }, [findNearestStation, calculateDistance]); // Added missing dependency

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