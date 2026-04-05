import { useEffect, useRef } from 'react'

export default function StudyMethodsSection() {
    // Cria uma referência direta ao nó <section> no DOM,
    // sem causar re-render. Começa como null pois o elemento
    // ainda não foi montado quando o componente é criado.
    const sectionRef = useRef(null)

    useEffect(() => {
        // Busca todos os elementos com o atributo data-animate
        // dentro da <section>. O ?. evita erro se sectionRef.current
        // ainda for null no momento da execução.
        const elements = sectionRef.current?.querySelectorAll('[data-animate]')
        if (!elements) return

        // Cria um IntersectionObserver — API nativa do browser que
        // monitora quando elementos entram ou saem da área visível (viewport).
        const observer = new IntersectionObserver(
            (entries) => {
                // entries: lista dos elementos monitorados naquele momento
                entries.forEach((entry) => {
                    // isIntersecting: true quando o elemento está visível na tela
                    if (entry.isIntersecting) {
                        // Adiciona a classe que dispara a animação CSS
                        entry.target.classList.add('animate-in')
                    }
                })
            },
            // threshold: 0.1 significa que a animação dispara quando
            // 10% do elemento estiver visível na tela
            { threshold: 0.1 }
        )

        // Registra cada elemento [data-animate] no observer
        // para que o browser comece a monitorá-los
        elements.forEach((el) => observer.observe(el))

        // Cleanup: desconecta o observer quando o componente for
        // desmontado, evitando vazamento de memória
        return () => observer.disconnect()

    // [] vazio: executa o efeito apenas uma vez, após a montagem do componente
    }, [])

    return (
        <section
            ref={sectionRef}
            id="metodos-de-estudo"
            className="border-t border-[#E8E8DF] px-6 py-24 md:px-10 lg:px-20"
        >
            <div className="mx-auto max-w-6xl">

                {/* Titulo pitch sobre os metodos de estudo */}
                <div data-animate className="animate-on-scroll mb-14">
                    <span className="mb-5 inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A80]">
                        Métodos de estudo
                    </span>
                    <h2 className="font-serif-display text-[clamp(32px,3.5vw,46px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1A1A1A]">
                        Duas formas de registrar o que importa
                    </h2>
                </div>

                {/* Divisão das seções na mesma, contendo as materias e as anotações dentro do mesmo bloco */}
                <div className="flex flex-col gap-0 divide-y divide-[#E8E8DF] lg:flex-row lg:divide-x lg:divide-y-0">

                    {/* Descrição materias */}
                    <div data-animate className="animate-on-scroll flex flex-col gap-8 pb-12 lg:w-1/2 lg:pb-0 lg:pr-14">
                        <div>
                            <span className="mb-3 inline-block text-[10px] font-medium uppercase tracking-[0.14em] text-[#CBCBC2]">
                                Matérias
                            </span>
                            <h3 className="mb-2 text-[18px] font-medium tracking-tight text-[#1A1A1A]">
                                Matérias organizadas no seu Dashboard
                            </h3>
                            <p className="text-[14px] font-light leading-[1.7] text-[#8A8A80]">
                                Cada matéria no seu lugar, crie, edite e consulte suas tarefas sem perder nada.
                            </p>
                        </div>

                        {/* Quadro simulando as materias*/}
                        <div className="rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5 flex gap-3 flex-1">
                            {/* Lateral com as matérias */}
                            <div className="flex flex-col gap-7 shrink-0">
                                {/* Sobre as matérias, i===0 identifica a primeira
                                    (Matemática) para aplicar estilo de "selecionada" */}
                                {['Matemática', 'Biologia', 'Física'].map((tab, i) => (
                                    <div
                                        key={tab}
                                        className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
                                            i === 0
                                                ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                                : 'bg-[#EBEBE5] text-[#8A8A80]'
                                        }`}
                                    >
                                        {tab}
                                    </div>
                                ))}
                            </div>

                            {/* Caderno com espaço em branco */}
                            <div className="flex-1 rounded-lg border border-[#E8E8DF] bg-white p-5">
                            </div>
                        </div>
                    </div>

                    {/* Titulo Pitch das anotações */}
                    <div data-animate className="animate-on-scroll flex flex-col gap-8 pt-12 lg:w-1/2 lg:pl-14 lg:pt-0">
                        <div>
                            <span className="mb-3 inline-block text-[10px] font-medium uppercase tracking-[0.14em] text-[#CBCBC2]">
                                Anotações em Post-its
                            </span>
                            <h3 className="mb-2 text-[18px] font-medium tracking-tight text-[#1A1A1A]">
                                Capture ideias no momento certo
                            </h3>
                            <p className="text-[14px] font-light leading-[1.7] text-[#8A8A80]">
                                Notas rápidas e visuais, sempre no seu dashboard quando você precisar.
                            </p>
                        </div>

                        {/* Post-its com conteudos e cores de exemplificação */}
                        <div className="grid grid-cols-2 gap-2.5 max-w-sm">
                            {/* Sobre os post-its backgroundColor é aplicado via style
                                inline pois são valores dinâmicos  não existem como classes
                                fixas no Tailwind */}
                            {[
                                { bg: '#FDF6D3', text: 'Revisar cap. 4 antes da prova' },
                                { bg: '#D8F0D8', text: 'Exercícios de derivadas — pág. 78' },
                                { bg: '#F5D8D8', text: 'Ver vídeo: Segunda Guerra Mundial' },
                                { bg: '#D8E8F5', text: 'Fórmulas de cinemática — rever' },
                            ].map((note, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-xl p-4 text-[12px] font-normal leading-[1.6] text-[#3A3A35]"
                                    style={{ backgroundColor: note.bg }}
                                >
                                    {note.text}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
