import { useEffect, useState, useCallback, useRef } from 'react';

const useGPSTracking = (destination, stations = []) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [gpsCurrentStation, setGpsCurrentStation] = useState(null);
  const [gpsNextStation, setGpsNextStation] = useState(null);
  const [gpsProgress, setGpsProgress] = useState(0);

  const gpsCurrentStationRef = useRef(null);
  const gpsNextStationRef = useRef(null);

  // Keep refs in sync
  useEffect(() => { gpsCurrentStationRef.current = gpsCurrentStation; }, [gpsCurrentStation]);
  useEffect(() => { gpsNextStationRef.current = gpsNextStation; }, [gpsNextStation]);

  // Haversine distance
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Find nearest station
  const findNearestStation = useCallback((lat, lng) => {
    let nearest = null;
    let minDistance = Infinity;

    stations.forEach(station => {
      const distance = calculateDistance(lat, lng, station.lat, station.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return { station: nearest, distance: minDistance };
  }, [stations, calculateDistance]);

  // Determine next station
  const determineNextStation = useCallback((currentStationId, destinationId) => {
    if (!currentStationId || !destinationId) return null;
    const currentIndex = stations.findIndex(s => s.id === currentStationId);
    const destIndex = stations.findIndex(s => s.id === destinationId);
    if (currentIndex === -1 || destIndex === -1 || currentIndex === destIndex) return null;
    return currentIndex < destIndex ? stations[currentIndex + 1] : stations[currentIndex - 1];
  }, [stations]);

  // Whenever current station or destination changes, update next station immediately
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

  // Fetch initial current station if userLocation exists
  useEffect(() => {
    if (userLocation && stations.length) {
      const { station } = findNearestStation(userLocation.lat, userLocation.lng);
      setGpsCurrentStation(station);

      if (destination) {
        const nextStation = determineNextStation(station.id, destination.id);
        setGpsNextStation(nextStation);
        setGpsProgress(0);
      }
    } else {
      setGpsCurrentStation(null);
      setGpsNextStation(null);
      setGpsProgress(0);
    }
  }, [stations, userLocation, destination, findNearestStation, determineNextStation]);

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

        if (distance < 0.5) {
          setGpsCurrentStation(prev => (!prev || prev.id !== station.id ? station : prev));
        }

        const currentStation = gpsCurrentStationRef.current;
        const nextStation = gpsNextStationRef.current;

        if (currentStation && nextStation) {
          const distToCurrent = calculateDistance(latitude, longitude, currentStation.lat, currentStation.lng);
          const totalDist = calculateDistance(currentStation.lat, currentStation.lng, nextStation.lat, nextStation.lng);
          const progressPercent = (distToCurrent / totalDist) * 100;
          setGpsProgress(Math.min(Math.max(progressPercent, 0), 100));
        }

        setLocationError('');
      },
      (error) => {
        setLocationError(`GPS Error: ${error.message}`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [findNearestStation, calculateDistance]);

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
