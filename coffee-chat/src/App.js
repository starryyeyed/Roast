import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getSession } from './utils/store';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import MeetingPage from './pages/MeetingPage';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export default function App() {
  const [session, setSession] = useState(null);
  const [activeMeetingId, setActiveMeetingId] = useState(null);
  const [homeKey, setHomeKey] = useState(0); // force re-render of home

  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
  }, []);

  function handleSessionCreated(s) {
    setSession(s);
  }

  function handleOpenMeeting(id) {
    setActiveMeetingId(id);
  }

  function handleBackHome() {
    setActiveMeetingId(null);
    setHomeKey(k => k + 1);
  }

  if (!session) {
    return <OnboardingPage onDone={handleSessionCreated} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0E0A07' }}>
      <AnimatePresence mode="wait">
        {activeMeetingId ? (
          <motion.div key={'meeting_' + activeMeetingId} {...fade}>
            <MeetingPage
              meetingId={activeMeetingId}
              session={session}
              onBack={handleBackHome}
            />
          </motion.div>
        ) : (
          <motion.div key={'home_' + homeKey} {...fade}>
            <HomePage
              session={session}
              onOpenMeeting={handleOpenMeeting}
              onRefresh={() => setHomeKey(k => k + 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}