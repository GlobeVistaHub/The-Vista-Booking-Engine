import { motion } from "framer-motion";

export const Shimmer = () => {
  return (
    <div className="relative overflow-hidden bg-navy/5 rounded-2xl w-full h-full">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
};
