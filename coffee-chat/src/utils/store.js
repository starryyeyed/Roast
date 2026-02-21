// store.js — simple localStorage-backed state for the demo
// In a real app this would be a backend (Firebase, Supabase, etc.)
// We simulate TWO users by storing both their states under different keys.
// The invite link (shareId) ties them together.

const PREFIX = 'roast_';

export function save(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}

// ── Session ──────────────────────────────────────────────────────────────────
// Each "user" gets a sessionId. In the demo, we have user A and user B.
// Switching between them simulates two people using the app.

export function getSession() {
  return load('session', null);
}

export function createSession(name, linkedInUrl) {
  const id = 'user_' + Math.random().toString(36).slice(2, 8);
  const session = { id, name, linkedInUrl, createdAt: Date.now() };
  save('session', session);
  return session;
}

export function clearSession() {
  remove('session');
}

// ── Meetings ─────────────────────────────────────────────────────────────────

export function getMeeting(meetingId) {
  return load('meeting_' + meetingId, null);
}

export function saveMeeting(meeting) {
  save('meeting_' + meeting.id, meeting);
}

export function createMeeting(hostSession, guestLinkedIn) {
  const id = Math.random().toString(36).slice(2, 8).toUpperCase();
  const meeting = {
    id,
    hostId: hostSession.id,
    hostName: hostSession.name,
    hostLinkedIn: hostSession.linkedInUrl,
    guestLinkedIn,
    guestId: null,
    guestName: null,
    status: 'pending', // pending → availability → swiping → confirmed
    hostSlots: [],
    guestSlots: [],
    hostLikes: [],
    guestLikes: [],
    agreedTime: null,
    agreedCafe: null,
  };
  saveMeeting(meeting);
  // Also store in user's meeting list
  const meetings = load('meetings_' + hostSession.id, []);
  meetings.unshift(id);
  save('meetings_' + hostSession.id, meetings);
  return meeting;
}

export function joinMeeting(meetingId, guestSession) {
  const meeting = getMeeting(meetingId);
  if (!meeting) return null;
  meeting.guestId = guestSession.id;
  meeting.guestName = guestSession.name;
  meeting.status = 'availability';
  saveMeeting(meeting);
  const meetings = load('meetings_' + guestSession.id, []);
  if (!meetings.includes(meetingId)) meetings.unshift(meetingId);
  save('meetings_' + guestSession.id, meetings);
  return meeting;
}

export function getUserMeetings(userId) {
  const ids = load('meetings_' + userId, []);
  return ids.map(id => getMeeting(id)).filter(Boolean);
}

// ── Availability ─────────────────────────────────────────────────────────────

export function saveSlots(meetingId, userId, slots) {
  const meeting = getMeeting(meetingId);
  if (!meeting) return;
  if (meeting.hostId === userId) meeting.hostSlots = slots;
  else meeting.guestSlots = slots;
  // If both have submitted, advance to swiping
  if (meeting.hostSlots.length > 0 && meeting.guestSlots.length > 0) {
    meeting.status = 'swiping';
    meeting.agreedTime = findOverlap(meeting.hostSlots, meeting.guestSlots);
  }
  saveMeeting(meeting);
  return meeting;
}

export function findOverlap(slotsA, slotsB) {
  const setB = new Set(slotsB);
  const overlap = slotsA.filter(s => setB.has(s));
  return overlap.length > 0 ? overlap[0] : null; // return first match
}

// ── Cafe Swipes ──────────────────────────────────────────────────────────────

export function saveCafeLikes(meetingId, userId, likedIds) {
  const meeting = getMeeting(meetingId);
  if (!meeting) return;
  if (meeting.hostId === userId) meeting.hostLikes = likedIds;
  else meeting.guestLikes = likedIds;
  // If both have swiped, find agreed cafe
  if (meeting.hostLikes.length > 0 && meeting.guestLikes.length > 0) {
    const setB = new Set(meeting.guestLikes);
    const mutual = meeting.hostLikes.find(id => setB.has(id));
    if (mutual) {
      meeting.agreedCafe = mutual;
      meeting.status = 'confirmed';
    }
  }
  saveMeeting(meeting);
  return meeting;
}