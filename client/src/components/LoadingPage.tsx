import { motion } from "framer-motion";

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* <motion.div
        initial={{ rotate: -20 }}
        animate={{ rotate: 20 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.5,
        }}
        className="w-24 h-24 mb-8"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 12L13 5V9H4V15H13V19L20 12Z"
            fill="#4CAF50"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div> */}
      {/* <h1 className="text-2xl mt-32">Loading...</h1> */}
      <p className="text-lg mt-32">Loading...</p>
      <div className="mt-8 flex space-x-2">
        <motion.div
          className="w-3 h-3 bg-black rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
        />
        <motion.div
          className="w-3 h-3 bg-black rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 bg-black rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
        />
      </div>
    </div>
  );
}
