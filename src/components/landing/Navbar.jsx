export default function Navbar({ onGetStarted }) {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-md bg-opacity-30">
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-semibold text-white">AgriDetect AI</div>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleScroll('about')}
            className="text-white hover:text-agri-green transition-colors duration-300"
          >
            About
          </button>
          <button
            onClick={() => handleScroll('services')}
            className="text-white hover:text-agri-green transition-colors duration-300"
          >
            Services
          </button>
          <button
            onClick={() => handleScroll('features')}
            className="text-white hover:text-agri-green transition-colors duration-300"
          >
            Features
          </button>
          <button
            onClick={() => handleScroll('how-it-works')}
            className="text-white hover:text-agri-green transition-colors duration-300"
          >
            How it Works
          </button>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="bg-white text-agri-button-dark font-semibold px-6 py-2.5 rounded-full hover:bg-agri-green-light transition-all duration-300 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
