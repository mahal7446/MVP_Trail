export default function Features() {
  const features = [
    {
      id: 'features',
      icon: '🔍',
      title: 'Instant Detection',
      description: 'Identify plant diseases in seconds with advanced AI algorithms',
    },
    {
      id: 'analysis',
      icon: '📊',
      title: 'Detailed Analysis',
      description: 'Get comprehensive insights into disease severity and progression',
    },
    {
      id: 'solutions',
      icon: '💡',
      title: 'Smart Solutions',
      description: 'Receive personalized treatment recommendations for your crops',
    },
    {
      id: 'tracking',
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your crop health over time with detailed reports',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to keep your crops healthy and productive
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-agri-green-light transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
