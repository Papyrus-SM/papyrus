import { useEffect, useRef } from 'react'
import HeroActions from './HeroActions'

export default function HeroSection() {
    const heroRef = useRef(null)

    useEffect(() => {
        const elements = heroRef.current?.querySelectorAll('[data-animate]')
        if (!elements) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in')
                    }
                })
            },
            { threshold: 0.1 }
        )

        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={heroRef}
            className="flex min-h-screen items-center px-6 pt-16 md:px-10 lg:px-20"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-16 lg:flex-row lg:items-center lg:gap-20">
                <div className="relative flex-1">
                    <div
                        data-animate
                        className="animate-on-scroll absolute -right-10 -top-16 z-0 hidden opacity-0 md:block"
                    >
                    </div>

                    <div className="relative z-10">
                        <div data-animate className="animate-on-scroll">
              <span className="mb-6 inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A80]">
                Produtividade acadêmica
              </span>
                        </div>

                        <div data-animate className="animate-on-scroll">
                            <h1 className="mb-7 font-serif-display text-[clamp(52px,6vw,80px)] font-normal leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                                Papyrus
                            </h1>
                        </div>

                        <div data-animate className="animate-on-scroll">
                            <p className="max-w-[400px] text-[17px] font-light leading-[1.75] text-[#5A5A52]">
                                Um sistema de organização para estudantes que querem controle
                                real sobre sua rotina com cadernos, flashcards, Pomodoro e
                                grade semanal em um só lugar.
                            </p>
                        </div>
                    </div>
                </div>

                <HeroActions />
            </div>
        </section>
    )
}