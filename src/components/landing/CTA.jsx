import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CTA({ onGetStarted }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-agri-green rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Main CTA Card */}
          <motion.div
            className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 p-12 md:p-16 rounded-3xl shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                }}
                animate={{
                  backgroundPosition: isHovered ? ['0px 0px', '30px 30px'] : '0px 0px',
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Glowing Orbs */}
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"
              animate={{
                scale: isHovered ? 1.5 : 1,
                opacity: isHovered ? 0.2 : 0.1,
              }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-300 rounded-full opacity-10 blur-3xl"
              animate={{
                scale: isHovered ? 1.5 : 1,
                opacity: isHovered ? 0.2 : 0.1,
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />

            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white border-opacity-30"
              >
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  ✨ Join the Revolution
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                Ready to Transform Your{' '}
                <motion.span
                  animate={{
                    textShadow: isHovered
                      ? '0 0 20px rgba(255,255,255,0.8)'
                      : '0 0 0px rgba(255,255,255,0)',
                  }}
                  className="text-yellow-300"
                >
                  Farming?
                </motion.span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-green-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Join thousands of farmers who are already using AgriDetect AI to protect their crops and increase yields.
              </motion.p>



              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                onClick={onGetStarted}
                className="group relative px-12 py-5 bg-white text-agri-green font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    scale: isHovered ? 1 : 0.9,
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>

              {/* Trust Badge */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-green-100 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free to start • No credit card required
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
