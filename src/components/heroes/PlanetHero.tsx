import { motion } from 'framer-motion';

const RedPlanet = () => (
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] md:-translate-y-[40%] z-10 pointer-events-none w-[40vh] h-[40vh] md:w-[60vh] md:h-[60vh]"
    style={{ perspective: '1000px' }}
  >
    <div className="w-full h-full relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
      {/* Planet Surface */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="absolute w-[60%] h-[60%] rounded-full bg-black shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #93c5fd 0%, #3b82f6 20%, #1d4ed8 50%, #172554 85%, #000000 100%)',
          boxShadow: '0 0 80px rgba(96, 165, 250, 0.3), inset 0 0 60px rgba(0,0,0,0.8)',
          transform: 'translateZ(0px)',
        }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-blue-400 mix-blend-screen blur-[30px] opacity-40"
        />
      </motion.div>

      {/* Rings */}
      <div
        className="absolute w-[180%] h-[180%] flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(78deg) rotateY(10deg)' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(transparent 50%, rgba(96,165,250,0.05) 55%, rgba(96,165,250,0.1) 60%, rgba(96,165,250,0.05) 65%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 0 40px rgba(96, 165, 250, 0.2)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-[28%] border-[12px] border-dashed border-blue-400/20 rounded-full opacity-80 blur-[2px]" />
          <div className="absolute inset-[30%] border-[2px] border-white/10 rounded-full opacity-60" />
        </motion.div>

        <motion.div
          className="absolute w-[65%] h-[65%] rounded-full border-[3px] border-blue-300/40"
          style={{ boxShadow: '0 0 20px rgba(96,165,250,0.4)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  </div>
);

const Landscape = () => (
  <div className="absolute bottom-0 left-0 right-0 h-[35vh] z-20 overflow-hidden flex justify-center pointer-events-none">
    <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-[#030303] via-[#030303] to-transparent z-20" />
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 1.5, ease: 'circOut' }}
      className="absolute bottom-0 w-full max-w-lg md:max-w-2xl h-full origin-bottom z-10"
      style={{ perspective: '200px' }}
    >
      <div
        className="relative w-full h-full bg-gradient-to-b from-transparent via-[#0a0f1a] to-[#030303]"
        style={{ clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] mix-blend-overlay" />
        <motion.div
          animate={{ backgroundPosition: '0 100px' }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(96,165,250,0.15)_50%,rgba(96,165,250,0)_100%)] bg-[length:100%_20px]"
        />
      </div>
    </motion.div>
  </div>
);

export default function PlanetHero() {
  return (
    <>
      <RedPlanet />
      <Landscape />
    </>
  );
}
