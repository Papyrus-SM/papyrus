// DashboardHeader.jsx
// MUDANÇAS: Nenhuma mudança funcional — componente já estava correto e limpo.
// Mantido exatamente como estava.

export default function DashboardHeader({ eyebrow = 'Dashboard', title = 'Visão geral' }) {
    return (
        <header className="flex items-center justify-between border-b border-[#E8E8DF] px-8 py-6">
            <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                    {eyebrow}
                </p>
                <h1 className="mt-2 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">
                    {title}
                </h1>
            </div>
        </header>
    )
}