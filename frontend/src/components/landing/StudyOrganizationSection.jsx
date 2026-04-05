import { useEffect, useRef } from 'react'

export default function StudyOrganizationSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const elements = sectionRef.current?.querySelectorAll('[data-animate]')
        if (!elements) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in')
                    }
                })
            },
            { threshold: 0.08 }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])
    return (
        <section
            ref={sectionRef}
            id="organizacao"
            className="border-t border-[#E8E8DF] bg-[#F5F5F0] px-6 py-24 md:px-10 lg:px-20"
        >
            <div className="mx-auto max-w-5xl">

                <div className="mb-16 text-center">
                    <div data-animate className="animate-on-scroll">
                        <span className="mb-5 inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A80]">
                            Organização
                        </span>
                    </div>
                    <div data-animate className="animate-on-scroll">
                        <h2 className="mb-5 font-serif-display text-[clamp(34px,3.8vw,52px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
                            Foco real com o método Pomodoro
                        </h2>
                    </div>
                    <div data-animate className="animate-on-scroll">
                        <p className="mx-auto max-w-[480px] text-[16px] font-light leading-[1.75] text-[#5A5A52]">
                            Estude em ciclos curtos, mais foco, menos cansaço
                            o Pomodoro é o coração da sua rotina no Papyrus.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">

                    {/* Posicionamento do Timer*/}
                    <div data-animate className="animate-on-scroll flex shrink-0 flex-col items-center">
                        <div className="relative flex h-52 w-52 items-center justify-center">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                                {/* Circulo da porcentagem (base de fundo para efeito) */}
                                <circle
                                    cx="50" cy="50" r="44"
                                    fill="none"
                                    stroke="#E8E8DF"
                                    strokeWidth="5"
                                />
                                {/* Circulo da porcentagem */}
                                <circle
                                    cx="50" cy="50" r="44"
                                    fill="none"
                                    stroke="#1A1A1A"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray="276.5"
                                    strokeDashoffset="71"
                                />
                            </svg>
                            <div className="z-10 text-center">
                                <p className="text-[38px] font-medium tracking-[-0.03em] text-[#1A1A1A]">
                                    18:32
                                </p>
                                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#AAAAA0]">
                                    foco
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pitch sobre Pomodoro ja estilizado */}
                    <div className="flex flex-col gap-8">
                        {[
                            {
                                title: '30 minutos de foco profundo',
                                desc: 'Cada ciclo Pomodoro é dedicado inteiramente a uma tarefa. Sem distrações, sem multitarefa.',
                            },
                            {
                                title: 'Pausas que renovam a energia',
                                desc: 'Após cada sessão, uma pausa curta. A cada quatro ciclos, uma pausa longa para recuperar o ritmo.',
                            },
                            {
                                title: 'Histórico de sessões',
                                desc: '....',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                data-animate
                                className="animate-on-scroll flex items-start gap-4"
                            >
                                <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A1A1A]" />
                                <div>
                                    <p className="mb-1 text-[15px] font-medium text-[#1A1A1A]">
                                        {item.title}
                                    </p>
                                    <p className="text-[14px] font-light leading-[1.7] text-[#8A8A80]">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
