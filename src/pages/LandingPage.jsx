import { useState, useEffect } from 'react';
import Features from "../components/LandingPage/Features";
import HeroSection from "../components/LandingPage/HeroSection";
import TrendingShowcase from "../components/LandingPage/TrendingShowcase";
import HowItWorks from "../components/LandingPage/HowItWorks";
import FAQ from "../components/LandingPage/FAQ";
import CTA from "../components/LandingPage/CTA";
import backgroundImg from '../assets/background.webp';

const LandingPageMain = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImg;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {isImageLoaded && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140vh] bg-cover bg-center bg-no-repeat opacity-[0.18] mix-blend-screen"
            style={{ backgroundImage: `url(${backgroundImg})` }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140vh] bg-gradient-to-b from-transparent via-background/40 to-background" />
        </>
      )}
      <HeroSection />
      <TrendingShowcase />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA />
    </div>
  );
};

export default LandingPageMain;
