// MUDANÇAS:
// 1. BUG CRÍTICO: Adicionados valores padrão (noop) para todos os handlers opcionais.
//    No DashboardPage, onEditClick/onDeleteClick/onOpenMateria não eram passados,
//    causando TypeError ao clicar. Agora degradam graciosamente.
// 2. DRY: Extraída lógica de teclas de acessibilidade inline para manter consistência.
// 3. Handlers de clique nos botões agora só são renderizados se o handler existir.

const noop = () => {}

export default function MateriasPanel({
                                          materias,
                                          loading,
                                          onCreateClick = noop,
                                          onEditClick,
                                          onDeleteClick,
                                          onOpenMateria,
                                          loadingDeleteMateriaId = null,
                                      }) {
    // Acessibilidade: abre a matéria via teclado apenas se o handler existir
    function handleCardKeyDown(event, materia) {
        if ((event.key === 'Enter' || event.key === ' ') && onOpenMateria) {
            event.preventDefault()
            onOpenMateria(materia)
        }
    }

    return (
        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Matérias</p>
                    <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">Suas matérias</h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">Aqui ficam as matérias cadastradas no seu ambiente.</p>
                </div>
                <button
                    type="button"
                    onClick={onCreateClick}
                    className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                >
                    Nova matéria
                </button>
            </div>

            <div className="mt-8">
                {loading && <p className="text-sm text-[#8A8A80]">Carregando matérias...</p>}

                {!loading && materias.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                        <p className="text-sm leading-7 text-[#5A5A52]">Você ainda não cadastrou nenhuma matéria.</p>
                    </div>
                )}

                {!loading && materias.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {materias.map((materia) => {
                            const isDeleting = loadingDeleteMateriaId === materia.id

                            return (
                                <article
                                    key={materia.id}
                                    // BUG FIX: role e handlers de interação só aplicados se onOpenMateria existir
                                    role={onOpenMateria ? 'button' : undefined}
                                    tabIndex={onOpenMateria ? 0 : undefined}
                                    onClick={onOpenMateria ? () => onOpenMateria(materia) : undefined}
                                    onKeyDown={onOpenMateria ? (e) => handleCardKeyDown(e, materia) : undefined}
                                    className={`rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5 transition hover:-translate-y-[1px] hover:border-[#D4D4CB] ${
                                        onOpenMateria ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 rounded-full border border-black/10"
                                            style={{ backgroundColor: materia.color_hex || '#F8FF97' }}
                                        />
                                        <h3 className="text-lg font-medium text-[#1A1A1A]">{materia.nome}</h3>
                                    </div>

                                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#5A5A52]">
                                        {materia.descricao || 'Sem descrição cadastrada.'}
                                    </p>

                                    {/* BUG FIX: Botões de ação só renderizados se os handlers forem fornecidos */}
                                    {(onEditClick || onDeleteClick) && (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {onEditClick && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onEditClick(materia)
                                                    }}
                                                    className="rounded-xl border border-[#CBCBC2] px-4 py-2 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]"
                                                >
                                                    Editar
                                                </button>
                                            )}

                                            {onDeleteClick && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onDeleteClick(materia)
                                                    }}
                                                    disabled={isDeleting}
                                                    className="rounded-xl border border-[#D9CACA] px-4 py-2 text-sm text-[#7A2E2E] transition hover:bg-[#FBF3F3] disabled:opacity-70"
                                                >
                                                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}