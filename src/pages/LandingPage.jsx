import Features from "../components/LandingPage/Features"
import HeroSection from "../components/LandingPage/HeroSection"
import Navbar from "../components/LandingPage/Navbar"
import FAQ from "../components/LandingPage/FAQ"
import CTA from "../components/LandingPage/CTA"
import Footer from "../components/Reusables/Footer"

const LandingPageMain = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Features/>
      <FAQ/>
      <CTA/>
      <Footer/>
    </>
  )
}

export default LandingPageMain