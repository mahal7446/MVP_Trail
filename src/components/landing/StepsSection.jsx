import { motion } from 'framer-motion';

export default function StepsSection() {
  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Capture',
      description: 'Take a photo of the affected plant leaf using your camera or upload from gallery',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconShadow: 'shadow-blue-500/50',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      badgeColor: 'bg-blue-500 text-white',
      glowColor: 'bg-blue-400',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      number: '02',
      title: 'Analyze',
      description: 'Our AI analyzes the image using advanced machine learning algorithms in seconds',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconShadow: 'shadow-purple-500/50',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      badgeColor: 'bg-purple-500 text-white',
      glowColor: 'bg-purple-400',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 3,
      number: '03',
      title: 'Treat',
      description: 'Get instant diagnosis and personalized treatment recommendations for your crops',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      iconShadow: 'shadow-green-500/50',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-300',
      badgeColor: 'bg-green-500 text-white',
      glowColor: 'bg-green-400',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white -mt-1 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 bg-agri-green bg-opacity-10 px-4 py-2 rounded-full mb-6 cursor-pointer"
          >
            <span className="text-agri-green font-semibold text-sm">HOW IT WORKS</span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Three Simple Steps to{' '}
            <motion.span
              className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% auto',
              }}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
              }}
            >
              Healthier Crops
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {['Revolutionary', 'farming', 'with', 'AI', '&', 'ML.', 'Get', 'instant', 'crop', 'solutions', 'in', 'just', 'three', 'easy', 'steps.'].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                whileHover={{
                  color: '#10b981',
                  scale: 1.1,
                  fontWeight: 600,
                }}
                className="inline-block mr-[0.3em] cursor-pointer"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid md:grid-cols-3 gap-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              className="relative group"
            >
              {/* Connecting Line (not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 left-full w-10 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
              )}

              {/* Card */}
              <motion.div
                whileHover={{ y: -15, scale: 1.03 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`relative ${step.bgColor} p-10 rounded-3xl border-2 ${step.borderColor} transition-all duration-300 shadow-xl group-hover:shadow-2xl cursor-pointer h-full overflow-hidden`}
              >
                {/* Animated gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 ${step.glowColor} rounded-full opacity-0 group-hover:opacity-60`}
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Step Number Badge */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`absolute top-6 right-6 w-14 h-14 rounded-full ${step.badgeColor} flex items-center justify-center font-bold text-lg shadow-lg`}
                >
                  {step.number}
                </motion.div>

                <div className="relative z-10">
                  {/* Icon Container with rotating ring */}
                  <div className="relative mb-8 w-24 h-24">
                    {/* Rotating ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-0 rounded-2xl border-2 ${step.borderColor} opacity-30`}
                    />

                    {/* Icon background */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`relative ${step.iconBg} ${step.iconShadow} w-full h-full rounded-2xl flex items-center justify-center shadow-2xl`}
                    >
                      {step.icon}
                    </motion.div>

                    {/* Glow effect */}
                    <motion.div
                      className={`absolute inset-0 ${step.glowColor} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed text-base">
                    {step.description}
                  </p>

                  {/* Decorative animated line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    className={`mt-6 h-1 ${step.iconBg} rounded-full`}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
