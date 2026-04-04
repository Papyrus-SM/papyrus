export default function WelcomeCard({ user }) {
    const nomeCompleto = user?.nome || 'estudante'
    const primeiroNome = nomeCompleto.split(' ')[0]

    return (
        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                    Início
                </p>

            <h2 className="mt-4 font-serif-display text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                Olá, {primeiroNome}
            </h2>

            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">
                Bem-vindo ao seu espaço de organização. Aqui você vai acompanhar
                sua rotina, matérias, calendário e métodos de estudo em um só lugar.
            </p>
        </section>
    )
}