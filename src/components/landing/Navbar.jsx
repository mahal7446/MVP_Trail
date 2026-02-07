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
        <div className="text-2xl font-semibold text-white">
          AgriDetect AI
        </div>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-8">
          {['about', 'services', 'features', 'how-it-works'].map((item) => (
            <button
              key={item}
              onClick={() => handleScroll(item)}
              className="text-white hover:text-agri-green transition-colors duration-300"
            >
              {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
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
