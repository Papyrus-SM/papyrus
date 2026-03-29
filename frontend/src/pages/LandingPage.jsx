import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import PlaceholderSection from '@/components/landing/PlaceholderSection'

export default function LandingPage() {
    const scrollToSection = () => {
        document.getElementById('em-criacao')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <Navbar onNavigate={scrollToSection} />
            <HeroSection />
            <PlaceholderSection />
        </div>
    )
}