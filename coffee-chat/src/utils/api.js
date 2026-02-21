import axios from 'axios';
import mockCafes from '../data/cafes';

// ─── OVERPASS API (OpenStreetMap) ───────────────────────────────────────────
// Completely free, no API key required. Fetches real cafes near a lat/lon.

export async function fetchCafesFromOSM(lat, lng, radiusMeters = 1500) {
  const query = `
    [out:json][timeout:10];
    node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
    out body;
  `;

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    const elements = response.data.elements;

    if (!elements || elements.length === 0) {
      console.warn('No cafes found via OSM, falling back to mock data');
      return mockCafes;
    }

    // Transform OSM format → our app's format
    return elements
      .filter(el => el.tags && el.tags.name) // only named cafes
      .slice(0, 15) // limit to 15 for the swipe deck
      .map((el, index) => ({
        id: `osm_${el.id}`,
        name: el.tags.name,
        address: formatOSMAddress(el.tags),
        rating: (3.5 + Math.random() * 1.5).toFixed(1), // OSM has no ratings; Yelp would replace this
        reviewCount: Math.floor(50 + Math.random() * 500),
        tags: extractOSMTags(el.tags),
        image: getCafeImage(index),
        hours: el.tags.opening_hours || 'Hours vary',
        priceLevel: el.tags['price:range'] || '$$',
        lat: el.lat,
        lon: el.lon,
        description: el.tags.description || el.tags['description:en'] || `A local cafe in ${el.tags['addr:city'] || 'the area'}.`
      }));
  } catch (error) {
    console.error('Overpass API error:', error);
    // Graceful fallback to mock data
    return mockCafes;
  }
}

function formatOSMAddress(tags) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'],
    tags['addr:state']
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Address not listed';
}

function extractOSMTags(tags) {
  const result = [];
  if (tags.wifi === 'yes' || tags.internet_access === 'wlan') result.push('wifi');
  if (tags.outdoor_seating === 'yes') result.push('outdoor seating');
  if (tags.takeaway === 'yes') result.push('takeaway');
  if (tags.organic === 'yes') result.push('organic');
  if (tags.cuisine) result.push(tags.cuisine);
  if (result.length === 0) result.push('cafe', 'coffee');
  return result.slice(0, 4);
}

// Cycle through beautiful Unsplash cafe photos
function getCafeImage(index) {
  const images = [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=400&h=300&fit=crop',
  ];
  return images[index % images.length];
}


// ─── YELP FUSION API (optional, for real ratings) ──────────────────────────
// Sign up at: https://www.yelp.com/developers  (free, just needs email)
// Store your key in .env as: REACT_APP_YELP_API_KEY=your_key_here
// NOTE: Yelp blocks direct browser requests (CORS). You need a tiny proxy.
// See server.js in the root folder for the Express proxy setup.

export async function fetchYelpReviews(cafeId) {
  const apiKey = process.env.REACT_APP_YELP_API_KEY;
  if (!apiKey) {
    // Return mock reviews if no API key
    return getMockReviews(cafeId);
  }

  try {
    // This calls your local proxy server (see server.js)
    const response = await axios.get(`/api/yelp/reviews/${cafeId}`);
    return response.data.reviews;
  } catch (error) {
    console.error('Yelp API error:', error);
    return getMockReviews(cafeId);
  }
}

function getMockReviews(cafeId) {
  return [
    { id: 1, author: "Sarah M.", rating: 5, text: "Best oat milk latte in the neighborhood. Comes here every Tuesday.", date: "2 days ago" },
    { id: 2, author: "James L.", rating: 4, text: "Reliable espresso and actually decent wifi. A rare combo.", date: "1 week ago" },
    { id: 3, author: "Anita K.", rating: 5, text: "Cozy corner tables, great for coffee chats. Staff remembers your order.", date: "2 weeks ago" }
  ];
}


// ─── GEOLOCATION ────────────────────────────────────────────────────────────

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to San Francisco if geolocation not available
      resolve({ lat: 37.7749, lng: -122.4194 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      (error) => {
        console.warn('Geolocation denied, using SF default');
        resolve({ lat: 37.7749, lng: -122.4194 });
      },
      { timeout: 5000 }
    );
  });
}