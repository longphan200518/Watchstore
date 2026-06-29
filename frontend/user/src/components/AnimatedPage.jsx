import { motion } from "framer-motion";

const pageVariants = {
 initial: { opacity: 0, y: 20 },
 animate: { opacity: 1, y: 0 },
 exit: { opacity: 0, y: -20 },
};

export default function AnimatedPage({ children }) {
 return (
 <motion.div
 initial="initial"
 animate="animate"
 exit="exit"
 variants={pageVariants}
 transition={{ duration: 0.5, ease: "easeInOut" }}
 >
 {children}
 </motion.div>
 );
}
