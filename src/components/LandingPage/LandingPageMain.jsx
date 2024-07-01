import Features from "./Features"
import HeroSection from "./HeroSection"
import Navbar from "./Navbar"
import FAQ from "./FAQ"
import CTA from "./CTA"
import Footer from "../Reusables/Footer"

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