import { useState, useEffect } from 'react';
import { fetchCafesFromOSM, getUserLocation } from '../utils/api';
import mockCafes from '../data/cafes';

export function useCafes() {
  const [cafes, setCafes] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCafes() {
      try {
        setLoading(true);
        const loc = await getUserLocation();
        setLocation(loc);

        const fetched = await fetchCafesFromOSM(loc.lat, loc.lng, 1500);
        
        // Merge real OSM cafes with mock cafe IDs for matching to work
        // In a real app, you'd do Yelp fuzzy matching here
        const merged = fetched.map((cafe, i) => ({
          ...cafe,
          // For matching algorithm, assign one of our known IDs if it's a real OSM cafe
          matchId: i < mockCafes.length ? mockCafes[i].id : cafe.id
        }));

        setCafes(merged.length > 0 ? merged : mockCafes);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setCafes(mockCafes); // Always fall back gracefully
      } finally {
        setLoading(false);
      }
    }

    loadCafes();
  }, []);

  return { cafes, location, loading, error };
}