export default function AuthHero({ eyebrow, title, description, items = [] }) {
    return (
        /*
            Bloco textual principal das páginas de autenticação.
            Apresenta o contexto da tela e, quando necessário,
            lista os principais benefícios do produto.
        */
        <div className="max-w-xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A80]">
                {eyebrow}
            </p>

            <h1 className="font-serif-display text-[clamp(42px,6vw,72px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                {title}
            </h1>

            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.75] text-[#5A5A52]">
                {description}
            </p>

            {items.length > 0 && (
                /*
                    Lista opcional de pontos de valor.
                    Útil principalmente na tela de registro.
                */
                <div className="mt-10 space-y-4 text-sm text-[#5A5A52]">
                    {items.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[#CBCBC2]" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}