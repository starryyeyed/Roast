// These are used as fallback/seed if the Overpass API is slow or fails
// Each cafe has an id that matches what alumni have in their likedCafes arrays
const mockCafes = [
  {
    id: "ritual_coffee",
    name: "Ritual Coffee Roasters",
    address: "1026 Valencia St, San Francisco, CA",
    rating: 4.5,
    reviewCount: 1842,
    tags: ["pour over", "specialty", "cozy", "wifi"],
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    hours: "7am – 8pm",
    priceLevel: "$$",
    lat: 37.7583,
    lon: -122.4213,
    description: "SF's beloved specialty roaster. Serious about coffee, relaxed about everything else."
  },
  {
    id: "sightglass",
    name: "Sightglass Coffee",
    address: "270 7th St, San Francisco, CA",
    rating: 4.4,
    reviewCount: 2103,
    tags: ["airy", "industrial", "meetings", "espresso"],
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop",
    hours: "7am – 7pm",
    priceLevel: "$$",
    lat: 37.7751,
    lon: -122.4094,
    description: "A stunning converted warehouse space. Great for long meetings and creative work."
  },
  {
    id: "blue_bottle",
    name: "Blue Bottle Coffee",
    address: "315 Linden St, San Francisco, CA",
    rating: 4.3,
    reviewCount: 3200,
    tags: ["minimalist", "queue-worthy", "precision", "espresso"],
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    hours: "7am – 6pm",
    priceLevel: "$$$",
    lat: 37.7756,
    lon: -122.4261,
    description: "The minimalist icon. Every cup is made with almost absurd precision."
  },
  {
    id: "four_barrel",
    name: "Verve Coffee Roasters",
    address: "2101 Market St, San Francisco, CA",
    rating: 4.2,
    reviewCount: 987,
    tags: ["light roast", "bright", "sunny", "laptop-friendly"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    hours: "7am – 7pm",
    priceLevel: "$$",
    lat: 37.7644,
    lon: -122.4356,
    description: "Santa Cruz vibes in the Mission. Bright, citrusy roasts in a sun-drenched space."
  },
  {
    id: "philz",
    name: "Philz Coffee",
    address: "748 Van Ness Ave, San Francisco, CA",
    rating: 4.6,
    reviewCount: 4521,
    tags: ["customized", "social", "blends", "community"],
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    hours: "6am – 10pm",
    priceLevel: "$$",
    lat: 37.7814,
    lon: -122.4210,
    description: "Hand-crafted blends made to order. The baristas actually ask how your day is going."
  },
  {
    id: "equator",
    name: "Equator Coffees",
    address: "986 Market St, San Francisco, CA",
    rating: 4.4,
    reviewCount: 1234,
    tags: ["ethical", "certified", "warm", "neighborhood"],
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop",
    hours: "7am – 6pm",
    priceLevel: "$$",
    lat: 37.7820,
    lon: -122.4147,
    description: "SF's most ethical roaster. Fair trade, organic, and genuinely delicious."
  },
  {
    id: "verve",
    name: "Sextant Coffee Roasters",
    address: "1415 Folsom St, San Francisco, CA",
    rating: 4.3,
    reviewCount: 678,
    tags: ["hidden gem", "pour over", "quiet", "focused"],
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    hours: "8am – 5pm",
    priceLevel: "$$",
    lat: 37.7710,
    lon: -122.4133,
    description: "A quiet, focused roaster away from the crowds. Perfect for deep conversations."
  }
];

export default mockCafes;