export default function StepsSection() {
  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Capture',
      description: 'Take a photo of the affected plant leaf using your camera or upload from gallery',
      iconBg: 'bg-blue-500',
      iconShadow: 'shadow-blue-500/30',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
        </svg>
      ),
    },
    {
      id: 2,
      number: '02',
      title: 'Analyze',
      description: 'Our AI analyzes the image using advanced machine learning algorithms in seconds',
      iconBg: 'bg-purple-500',
      iconShadow: 'shadow-purple-500/30',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-700',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      ),
    },
    {
      id: 3,
      number: '03',
      title: 'Treat',
      description: 'Get instant diagnosis and personalized treatment recommendations for your crops',
      iconBg: 'bg-green-500',
      iconShadow: 'shadow-green-500/30',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      badgeColor: 'bg-green-100 text-green-700',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3.8-1.95-3.8-4.9 0-3.37 2.76-5 5.5-5 1.6 0 2.93.36 3.96 1.12.33.25.59.56.72.94.05.18.08.36.08.55 0 .28-.22.5-.5.5-.37 0-.67-.26-.8-.61-.35-1.09-1.27-1.5-2.46-1.5-1.8 0-2.99.87-2.99 2.51 0 1.93.85 2.9 2.99 3.57 2.5.69 4.01 1.95 4.01 5.04 0 3.35-2.72 5-5.5 5-1.97 0-3.32-.48-4.35-1.38-.33-.3-.59-.66-.77-1.05-.05-.16-.08-.33-.08-.51 0-.28.22-.5.5-.5.37 0 .67.26.8.61.38 1.05 1.3 1.73 2.9 1.73 1.88 0 3.13-.87 3.13-2.53 0-2.08-.85-2.92-3-3.57z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-white -mt-1">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Three Simple Steps to{' '}
            <span className="text-agri-green">Healthier Crops</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Revolutionary farming with AI & ML. Get instant crop solutions in just three easy steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative ${step.bgColor} p-12 rounded-3xl border-2 ${step.borderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-3 group`}
            >
              {/* Step Number Badge */}
              <div className={`absolute top-6 right-6 w-12 h-12 rounded-full ${step.badgeColor} flex items-center justify-center font-bold text-lg`}>
                {step.number}
              </div>

              {/* Icon Container */}
              <div className={`${step.iconBg} ${step.iconShadow} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg`}>
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-base">
                {step.description}
              </p>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-agri-green to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ width: '100%' }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
