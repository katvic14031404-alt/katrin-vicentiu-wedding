import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Atmosphere from './components/ui/Atmosphere';
import Landing from './components/landing/Landing';
import Invitation from './components/invitation/Invitation';

/**
 * Two "pages": the envelope (landing) and the invitation.
 * MotionConfig reducedMotion="user" makes every Motion animation
 * respect the OS reduced-motion preference automatically.
 */
export default function App() {
  const [opened, setOpened] = useState(false);

  const reseal = () => {
    window.scrollTo({ top: 0 });
    setOpened(false);
  };

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <Atmosphere variant={opened ? 'invitation' : 'landing'} />
      <AnimatePresence mode="wait">
        {opened ? (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            <Invitation onReseal={reseal} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.9 } }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)', transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] } }}
          >
            <Landing onOpened={() => setOpened(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
