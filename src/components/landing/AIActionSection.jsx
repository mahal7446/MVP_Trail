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
    <section className="py-24 bg-agri-gradient">
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
        <div className="max-w-3xl mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See AI in <span className="text-agri-green">Action</span>
          </h2>
          <p className="text-green-100 text-lg leading-relaxed font-medium">
            Our advanced computer vision technology powered by deep learning can identify early signs of crop problems before they spread.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left: Feature Cards - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-5">
            {featureGroups.map((group, idx) => (
              <div
                key={idx}
                className="fade-in-up h-48 bg-gradient-to-br from-green-900 from-opacity-30 to-green-950 to-opacity-40 backdrop-blur-md rounded-xl p-6 border border-agri-green-light border-opacity-60 hover:border-opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-agri-green hover:shadow-opacity-40 hover:-translate-y-1 flex flex-col shadow-md"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="text-white font-bold text-base mb-3 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-agri-green text-agri-button-dark flex items-center justify-center text-xs font-bold mr-2">
                    ✓
                  </span>
                  {group.category}
                </h3>
                <ul className="space-y-1.5 flex-1 overflow-hidden">
                  {group.items.map((item, i) => (
                    <li key={i} className="text-green-100 text-xs ml-7 flex items-start font-medium">
                      <span className="w-1 h-1 bg-agri-green rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: Image with Detection Markers */}
          <div className="relative fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Image Container */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              {/* Background Image with Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url("https://media.istockphoto.com/id/1061097354/photo/the-corn-plant-in-the-field.jpg?s=612x612&w=0&k=20&c=NEEzE5il-up8g7NZj_7HJUpyVep18zBRfhnMZ5laLiQ=")',
                }}
              ></div>

              
              {/* Detection Markers */}
              {/* Red Marker - Leaf Spot */}
              <div className="absolute top-1/3 left-1/4 float-marker">
                <div className="relative">
                  <div className="subtle-pulse w-10 h-10 bg-red-500 rounded-full border-3 border-red-300 shadow-lg shadow-red-500/50"></div>
                  <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-lg shadow-red-600/50 border border-red-400">
                    Leaf Spot Detected
                  </div>
                </div>
              </div>

              {/* Yellow Marker - Nutrient Deficiency */}
              <div className="absolute bottom-1/3 right-1/4 float-marker" style={{ animationDelay: '1s' }}>
                <div className="relative">
                  <div className="subtle-pulse w-10 h-10 bg-yellow-400 rounded-full border-3 border-yellow-200 shadow-lg shadow-yellow-400/50" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-lg shadow-amber-600/50 border border-amber-400">
                    Nutrient Deficiency
                  </div>
                </div>
              </div>

              {/* Bottom Analysis Card */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-900 to-transparent p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">Analysis Complete</span>
                    <span className="bg-agri-green text-agri-button-dark px-4 py-2 rounded-full text-sm font-bold border border-agri-green-light shadow-lg">
                      98% Confidence
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden border border-gray-600 shadow-md">
                    <div
                      className="bg-gradient-to-r from-agri-green to-agri-green-light h-2.5 rounded-full transition-all duration-1000 shadow-lg shadow-agri-green/50"
                      style={{ width: '98%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
