import axios from 'axios';

const CAFE_IMAGES = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=380&fit=crop',
  'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=500&h=380&fit=crop',
];

export async function fetchNearbyCafes(lat, lng) {
  const query = `[out:json][timeout:10];node["amenity"="cafe"](around:1500,${lat},${lng});out body;`;
  try {
    const res = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' }
    });
    const elements = res.data.elements.filter(e => e.tags?.name).slice(0, 12);
    if (elements.length < 3) return getFallbackCafes();
    return elements.map((el, i) => ({
      id: `osm_${el.id}`,
      name: el.tags.name,
      address: [el.tags['addr:housenumber'], el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', ') || 'Nearby',
      rating: (3.8 + Math.random() * 1.2).toFixed(1),
      tags: extractTags(el.tags),
      image: CAFE_IMAGES[i % CAFE_IMAGES.length],
      hours: el.tags.opening_hours || '7am – 7pm',
      lat: el.lat,
      lon: el.lon,
    }));
  } catch {
    return getFallbackCafes();
  }
}

function extractTags(tags) {
  const out = [];
  if (tags.wifi === 'yes') out.push('wifi');
  if (tags.outdoor_seating === 'yes') out.push('outdoor');
  if (tags.takeaway === 'yes') out.push('takeaway');
  if (out.length === 0) out.push('espresso', 'cozy');
  return out.slice(0, 3);
}

export function getFallbackCafes() {
  return [
    { id: 'fc1', name: 'Ritual Coffee Roasters', address: '1026 Valencia St', rating: '4.5', tags: ['pour over', 'cozy', 'wifi'], image: CAFE_IMAGES[0], hours: '7am–8pm', lat: 37.7583, lon: -122.4213 },
    { id: 'fc2', name: 'Sightglass Coffee', address: '270 7th St', rating: '4.4', tags: ['industrial', 'meetings'], image: CAFE_IMAGES[1], hours: '7am–7pm', lat: 37.7751, lon: -122.4094 },
    { id: 'fc3', name: 'Blue Bottle Coffee', address: '315 Linden St', rating: '4.3', tags: ['minimalist', 'espresso'], image: CAFE_IMAGES[2], hours: '7am–6pm', lat: 37.7756, lon: -122.4261 },
    { id: 'fc4', name: 'Philz Coffee', address: '748 Van Ness Ave', rating: '4.6', tags: ['customized', 'social'], image: CAFE_IMAGES[3], hours: '6am–10pm', lat: 37.7814, lon: -122.4210 },
    { id: 'fc5', name: 'Equator Coffees', address: '986 Market St', rating: '4.4', tags: ['ethical', 'warm'], image: CAFE_IMAGES[4], hours: '7am–6pm', lat: 37.7820, lon: -122.4147 },
    { id: 'fc6', name: 'Sextant Coffee', address: '1415 Folsom St', rating: '4.3', tags: ['quiet', 'pour over'], image: CAFE_IMAGES[5], hours: '8am–5pm', lat: 37.7710, lon: -122.4133 },
    { id: 'fc7', name: 'Verve Coffee', address: '2101 Market St', rating: '4.5', tags: ['light roast', 'sunny'], image: CAFE_IMAGES[6], hours: '7am–7pm', lat: 37.7644, lon: -122.4356 },
  ];
}

export function getUserLocation() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ lat: 37.7749, lng: -122.4194 });
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve({ lat: 37.7749, lng: -122.4194 }),
      { timeout: 5000 }
    );
  });
}