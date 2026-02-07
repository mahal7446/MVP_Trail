import { motion } from 'framer-motion';

export default function Navbar({ onGetStarted }) {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-md bg-opacity-30"
    >
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-semibold text-white"
        >
          AgriDetect AI
        </motion.div>

        {/* Nav Links - Hidden on mobile */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.4
              }
            }
          }}
          className="hidden md:flex items-center space-x-8"
        >
          {['about', 'services', 'features', 'how-it-works'].map((item) => (
            <motion.button
              key={item}
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleScroll(item)}
              className="text-white hover:text-agri-green transition-colors duration-300"
            >
              {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="bg-white text-agri-button-dark font-semibold px-6 py-2.5 rounded-full hover:bg-agri-green-light transition-all duration-300 shadow-lg"
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  );
}
