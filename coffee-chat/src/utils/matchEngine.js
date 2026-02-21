import alumni from '../data/alumni';

// ─── CORE MATCH ENGINE ──────────────────────────────────────────────────────
// Takes the user's liked cafe IDs and finds alumni with overlapping preferences.
// Returns alumni sorted by compatibility score (most shared cafes first).

export function findMatches(likedCafeIds) {
  if (!likedCafeIds || likedCafeIds.length === 0) return [];

  const matches = alumni
    .map(person => {
      const sharedCafes = person.likedCafes.filter(cafeId =>
        likedCafeIds.includes(cafeId)
      );

      // Compatibility score: shared cafes weighted by how selective the person is
      const score = sharedCafes.length / Math.sqrt(person.likedCafes.length);

      return {
        ...person,
        sharedCafes,
        compatibilityScore: score,
        compatibilityPercent: Math.min(100, Math.round(score * 50))
      };
    })
    .filter(person => person.sharedCafes.length > 0)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return matches;
}

// ─── SWIPE STATE MANAGER ─────────────────────────────────────────────────────
// Stores liked/disliked cafes in localStorage so they persist on refresh.

const STORAGE_KEY = 'brewmeet_swipes';

export function saveSwipe(cafeId, direction) {
  const existing = getSwipes();
  existing[cafeId] = direction; // 'right' or 'left'
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getSwipes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function getLikedCafeIds() {
  const swipes = getSwipes();
  return Object.entries(swipes)
    .filter(([_, dir]) => dir === 'right')
    .map(([id]) => id);
}

export function clearSwipes() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── GENERATE A COFFEE CHAT MESSAGE ─────────────────────────────────────────
// Auto-generates a personalized outreach message for the user to send.

export function generateChatMessage(alumnus, sharedCafe) {
  const cafeName = sharedCafe || 'a great local cafe';
  return `Hi ${alumnus.name}!

I came across your profile on BrewMeet and noticed we both love ${cafeName}${sharedCafe ? '' : ' and other great spots nearby'}. 

I'm currently [your situation] and would love to hear about your experience as a ${alumnus.role}. ${alumnus.bio ? `I especially resonated with your note about "${alumnus.bio.split('.')[0]}."` : ''}

Would you be open to a quick 20-minute coffee chat sometime? I'm flexible on timing.

Thanks so much!
[Your name]`;
}