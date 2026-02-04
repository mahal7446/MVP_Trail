import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StepsSection from './components/StepsSection';
import AIActionSection from './components/AIActionSection';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="w-full">
      <Navbar />
      <Hero />
      <StepsSection />
      <AIActionSection />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
