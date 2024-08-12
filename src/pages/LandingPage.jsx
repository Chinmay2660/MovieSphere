import { useState, useEffect } from 'react';
import Features from "../components/LandingPage/Features";
import HeroSection from "../components/LandingPage/HeroSection";
import FAQ from "../components/LandingPage/FAQ";
// import CTA from "../components/LandingPage/CTA";
import backgroundImg from '../assets/background.webp';

const LandingPageMain = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImg;
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, []);

  return (
    <>
      {isImageLoaded && (
        <div
          className='absolute w-[98vw] top-0 left-0 inset-0 bg-black opacity-30 -z-10 bg-cover bg-center bg-no-repeat'
          style={{ height: '120vh', backgroundImage: `url(${backgroundImg})` }}
        ></div>
      )}
      <HeroSection />
      <Features />
      <FAQ />
      {/* <CTA /> */}
    </>
  );
};

export default LandingPageMain;