import Features from "./Features"
import HeroSection from "./HeroSection"
import Navbar from "./Navbar"
import FAQ from "./FAQ"
import CTA from "./CTA"

const LandingPageMain = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Features/>
      <FAQ/>
      <CTA/>
    </>
  )
}

export default LandingPageMain