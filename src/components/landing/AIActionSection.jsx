import React from 'react';

export default function AIActionSection() {
  const featureGroups = [
    {
      category: 'Diseases',
      items: ['Maize rust', 'Leaf blight', 'Fungal infections', 'Bacterial diseases'],
    },
    {
      category: 'Pest Damage',
      items: ['Fall armyworm', 'Stem borer', 'Aphids', 'Destructive insects'],
    },
    {
      category: 'Nutrient Deficiencies',
      items: ['Nitrogen', 'Phosphorus', 'Potassium', 'Micronutrients'],
    },
    {
      category: 'Abiotic Stress',
      items: ['Drought stress', 'Cold damage', 'Heat stress', 'Environmental factors'],
    },
  ];

  return (
    <section id="services" className="py-24 bg-agri-gradient">
      <style>{`
        @keyframes float-marker {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .float-marker {
          animation: float-marker 3s ease-in-out infinite;
        }
        
        .subtle-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            See AI in{' '}
            <motion.span
              className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% auto',
              }}
              whileHover={{
                scale: 1.1,
                rotate: [-2, 2, -2],
                transition: { rotate: { duration: 0.5, repeat: 3 } }
              }}
            >
              Action
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-green-100 text-lg leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {['Our', 'advanced', 'computer', 'vision', 'technology', 'powered', 'by', 'deep', 'learning', 'can', 'identify', 'early', 'signs', 'of', 'crop', 'problems', 'before', 'they', 'spread.'].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.03 }}
                whileHover={{
                  color: '#22c55e',
                  scale: 1.05,
                  fontWeight: 700,
                }}
                className="inline-block mr-[0.35em] cursor-pointer"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid lg:grid-cols-2 gap-12 items-stretch"
        >
          {/* Left: Feature Cards - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-5">
            {featureGroups.map((group, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  borderColor: 'rgba(74, 222, 128, 1)',
                  boxShadow: '0 20px 40px rgba(74, 222, 128, 0.3)'
                }}
                transition={{ duration: 0.3 }}
                className="h-48 bg-gradient-to-br from-green-900/30 to-green-950/40 backdrop-blur-md rounded-xl p-6 border-2 border-agri-green-light/60 flex flex-col shadow-md cursor-pointer relative overflow-hidden group"
              >
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />

                <h3 className="text-white font-bold text-base mb-3 flex items-center relative z-10">
                  <motion.span
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="w-5 h-5 rounded-full bg-agri-green text-agri-button-dark flex items-center justify-center text-xs font-bold mr-2"
                  >
                    ✓
                  </motion.span>
                  {group.category}
                </h3>
                <ul className="space-y-1.5 flex-1 overflow-hidden relative z-10">
                  {group.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 5, color: '#22c55e' }}
                      className="text-green-100 text-xs ml-7 flex items-start font-medium cursor-pointer"
                    >
                      <span className="w-1 h-1 bg-agri-green rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Right: Image with Detection Markers */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 }
            }}
            className="relative"
          >
            {/* Image Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
            >
              {/* Background Image with Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: 'url("/corn.jpg")',
                }}
                whileHover={{
                  scale: 1.05,
                  filter: 'brightness(1.1)'
                }}
              ></motion.div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>


              {/* Detection Markers */}
              {/* Red Marker - Leaf Spot */}
              <motion.div
                className="absolute top-1/3 left-1/4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.3 }}
                    className="w-12 h-12 bg-red-500 rounded-full border-4 border-red-300 shadow-2xl shadow-red-500/60 flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-white text-xl">⚠</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap shadow-xl shadow-red-600/60 border-2 border-red-400"
                  >
                    Leaf Spot Detected
                  </motion.div>
                </div>
              </motion.div>

              {/* Yellow Marker - Nutrient Deficiency */}
              <motion.div
                className="absolute bottom-1/3 right-1/4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    whileHover={{ scale: 1.3 }}
                    className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-yellow-200 shadow-2xl shadow-yellow-400/60 flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-yellow-900 text-xl">⚡</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap shadow-xl shadow-amber-600/60 border-2 border-amber-400"
                  >
                    Nutrient Deficiency
                  </motion.div>
                </div>
              </motion.div>

              {/* Bottom Analysis Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-900 to-transparent p-8 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-white font-bold text-lg">Analysis Complete</span>
                    <motion.span
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className="bg-agri-green text-agri-button-dark px-4 py-2 rounded-full text-sm font-bold border border-agri-green-light shadow-lg cursor-pointer"
                    >
                      98% Confidence
                    </motion.span>
                  </motion.div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden border border-gray-600 shadow-md">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '98%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-agri-green to-agri-green-light h-2.5 rounded-full shadow-lg shadow-agri-green/50"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
