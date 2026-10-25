import CtaSection from '../components/home/CtaSection'
import DescriptionSection from '../components/home/DescriptionSection'
import HeroSection from '../components/home/HeroSection'
import OrientationSection from '../components/home/OrientationSection'
import ProblemSection from '../components/home/ProblemSection'
import ScheduleSection from '../components/home/ScheduleSection'
import ServicesSection from '../components/home/ServicesSection'
import SolutionSection from '../components/home/SolutionSection'
import SupportSection from '../components/home/SupportSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DescriptionSection />
      <ProblemSection />
      <SupportSection />
      <SolutionSection />
      <ServicesSection />
      <ScheduleSection />
      <OrientationSection />
      <CtaSection />
    </>
  )
}
