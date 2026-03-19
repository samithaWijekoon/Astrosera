import { motion } from 'framer-motion';

// Variants for page enter/exit animation
const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // custom cubic bezier for a premium feel
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

/**
 * Wrap any page component with this to get smooth animated transitions.
 * Usage: <PageTransition><YourPageContent /></PageTransition>
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
