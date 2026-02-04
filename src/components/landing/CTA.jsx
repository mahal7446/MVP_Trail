export default function CTA({ onGetStarted }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-agri-green from-opacity-5 to-transparent p-12 md:p-16 rounded-2xl border border-agri-green-light border-opacity-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgriDetect AI to protect their crops and increase yields.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-agri-green text-agri-button-dark font-semibold text-lg rounded-full hover:bg-agri-green-light transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
