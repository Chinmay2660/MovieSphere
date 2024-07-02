import Features from "../components/LandingPage/Features"
import HeroSection from "../components/LandingPage/HeroSection"
import FAQ from "../components/LandingPage/FAQ"
import CTA from "../components/LandingPage/CTA"
import backgroundImg from '../assets/background.webp';

const LandingPageMain = () => {
  return (
    <>
      <div
        className='absolute w-[99vw] top-0 left-0 inset-0 bg-black opacity-30 -z-10 bg-cover bg-center bg-no-repeat'
        style={{ height: '100vh', backgroundImage: `url(${backgroundImg})` }}
      >
      </div>
      <HeroSection />
      <Features />
      <FAQ />
      <CTA />
    </>
  )
}

export default LandingPageMain