export default function CadernoMain({
    cadernos,
    loading,
    onCreateClick,
    onOpenCaderno,
}) {

    return (
        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Cadernos</p>
                    <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">Seus cadernos</h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">Aqui ficam seus cadernos organizados por matéria.</p>
                </div>
                <button
                    type="button"
                    onClick={onCreateClick}
                    className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                >
                    Novo caderno
                </button>
            </div>

            <div className="mt-8">
                {loading && <p className="text-sm text-[#8A8A80]">Carregando cadernos...</p>}

                {!loading && cadernos.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                        <p className="text-sm leading-7 text-[#5A5A52]">Você ainda não criou nenhum caderno.</p>
                    </div>
                )}

                {!loading && cadernos.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {cadernos.map((caderno) => {
                            const cor = caderno.materia_cor || '#F8FF97'
                            const totalPaginas = caderno.total_paginas || 0

                            return (
                                <article
                                    key={caderno.id}
                                    role="button" // role do tipo "button" para acessibilidade, indicando que o elemento é interativo
                                    tabIndex={0}
                                    onClick={() => onOpenCaderno(caderno)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            onOpenCaderno(caderno)
                                        }
                                    }}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E8E8DF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                >
                                    {/* Capa do caderno */}
                                    <div
                                        className="relative px-5 pb-4 pt-5"
                                        style={{ backgroundColor: cor }}
                                    >
                                        <div
                                            className="absolute left-0 top-0 h-full w-[6px]"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}
                                        />
                                        <h3 className="text-base font-semibold leading-snug"
                                            style={{ color: isLightColor(cor) ? '#1A1A1A' : '#FAFAF7' }}
                                        >
                                            {caderno.titulo}
                                        </h3>
                                        <p className="mt-1 text-xs opacity-70"
                                            style={{ color: isLightColor(cor) ? '#3F3F39' : '#E8E8DF' }}
                                        >
                                            {caderno.materia_nome}
                                        </p>
                                    </div>

                                    {/* Corpo do caderno (páginas) */}
                                    <div className="relative px-5 py-4">
                                        <div className="space-y-[6px]">
                                            <div className="h-[1px] bg-[#E8E8DF]" />
                                            <div className="h-[1px] bg-[#E8E8DF]" />
                                            <div className="h-[1px] bg-[#E8E8DF]" />
                                            <div className="h-[1px] bg-[#E8E8DF]" />
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-[#8A8A80]">
                                                {totalPaginas === 0
                                                    ? 'Nenhuma página'
                                                    : totalPaginas === 1
                                                        ? '1 página'
                                                        : `${totalPaginas} páginas`
                                                }
                                            </span>
                                            <span className="text-xs text-[#8A8A80] opacity-0 transition group-hover:opacity-100">
                                                Abrir →
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

function isLightColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.6
}