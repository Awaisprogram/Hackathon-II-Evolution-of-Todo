import { motion } from "framer-motion";

const ThreeDotBounce = () => {
  return (
    <div className="flex justify-start gap-1">
    <motion.div
      className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity }}
    />
    <motion.div
      className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
    />
  </div>
  );
};

export default ThreeDotBounce;
