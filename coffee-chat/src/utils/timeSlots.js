// Generates a week of time slots for the availability grid

export const HOURS = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

export function getNextSevenDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10), // "2025-03-15"
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      short: d.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  return days;
}

export function slotKey(dayKey, hour) {
  return `${dayKey}|${hour}`;
}

export function parseSlot(slotKey) {
  const [day, hour] = slotKey.split('|');
  return { day, hour };
}

export function formatSlot(slotKey) {
  const { day, hour } = parseSlot(slotKey);
  const date = new Date(day + 'T12:00:00');
  const dayStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return `${dayStr} at ${hour}`;
}