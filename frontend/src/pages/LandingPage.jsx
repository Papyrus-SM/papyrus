import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StudyMethodsSection from '@/components/landing/StudyMethodsSection'
import StudyOrganizationSection from '@/components/landing/StudyOrganizationSection'
import PlaceholderSection from '@/components/landing/PlaceholderSection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
    const scrollToSection = (id) => {
        document.getElementById(id ?? 'em-criacao')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <Navbar onNavigate={scrollToSection} />
            <HeroSection />
            <StudyMethodsSection />
            <StudyOrganizationSection />
            <PlaceholderSection />
            <Footer />
        </div>
    )
}