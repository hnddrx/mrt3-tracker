import { useEffect, useState } from 'react';
import { MRT3_STATIONS } from '../data/mrt3Stations';

const useGPSTracking = (currentStation, nextStation, destination) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [gpsCurrentStation, setGpsCurrentStation] = useState(null);
  const [gpsNextStation, setGpsNextStation] = useState(null);
  const [gpsProgress, setGpsProgress] = useState(0);

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
        
        if (distance < 0.5) {
          if (!gpsCurrentStation || gpsCurrentStation.id !== station.id) {
            setGpsCurrentStation(station);
            
            const currentIndex = MRT3_STATIONS.findIndex(s => s.id === station.id);
            if (destination) {
              const destIndex = MRT3_STATIONS.findIndex(s => s.id === destination.id);
              if (currentIndex < destIndex && currentIndex < MRT3_STATIONS.length - 1) {
                setGpsNextStation(MRT3_STATIONS[currentIndex + 1]);
              } else if (currentIndex > destIndex && currentIndex > 0) {
                setGpsNextStation(MRT3_STATIONS[currentIndex - 1]);
              } else {
                setGpsNextStation(null);
              }
            }
          }
        } else {
          if (gpsCurrentStation && gpsNextStation) {
            const distToCurrent = calculateDistance(latitude, longitude, gpsCurrentStation.lat, gpsCurrentStation.lng);
            const totalDist = calculateDistance(gpsCurrentStation.lat, gpsCurrentStation.lng, gpsNextStation.lat, gpsNextStation.lng);
            const progressPercent = (distToCurrent / totalDist) * 100;
            setGpsProgress(Math.min(progressPercent, 100));
          }
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

    return () => navigator.geolocation.clearWatch(watchId);
  }, [gpsCurrentStation, gpsNextStation, destination]);

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