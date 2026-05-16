import { useState } from 'react'

const noop = () => {}

export default function FlashcardsPanel({
    flashcards,
    loading,
    onCreateClick = noop,
    onEditClick,
    onDeleteClick,
    loadingDeleteFlashcardId = null,
}) {
    const [flippedFlashcards, setFlippedFlashcards] = useState(new Set())

    function toggleFlashcardFlip(flashcard) {
        setFlippedFlashcards((previous) => {
            const next = new Set(previous)
            if (next.has(flashcard.id)) {
                next.delete(flashcard.id)
            } else {
                next.add(flashcard.id)
            }
            return next
        })
    }

    function handleCardKeyDown(event, flashcard) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggleFlashcardFlip(flashcard)
        }
    }

    return (
        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Flashcards</p>
                    <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">Seus flashcards</h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">Aqui ficam os flashcards cadastrados no seu ambiente.</p>
                </div>
                <button
                    type="button"
                    onClick={onCreateClick}
                    className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                >
                    Nova flashcard
                </button>
            </div>

            <div className="mt-8">
                {loading && <p className="text-sm text-[#8A8A80]">Carregando flashcards...</p>}

                {!loading && flashcards.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                        <p className="text-sm leading-7 text-[#5A5A52]">Você ainda não cadastrou nenhuma flashcard.</p>
                    </div>
                )}

                {!loading && flashcards.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {flashcards.map((flashcard) => {
                            const isDeleting = loadingDeleteFlashcardId === flashcard.id
                            const isFlipped = flippedFlashcards.has(flashcard.id)

                            return (
                                <article
                                    key={flashcard.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggleFlashcardFlip(flashcard)}
                                    onKeyDown={(e) => handleCardKeyDown(e, flashcard)}
                                    style={{ perspective: 1000 }}
                                    className="rounded-2xl border border-[#E8E8DF] bg-transparent p-5 transition hover:-translate-y-[1px] hover:border-[#D4D4CB] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                >
                                    <div
                                        className="relative h-full min-h-[160px]"
                                        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s ease' , transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}
                                    >
                                        <div
                                            className="absolute inset-0 rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5"
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-3 w-3 rounded-full border border-black/10"
                                                    style={{ backgroundColor: flashcard.color_hex || '#F8FF97' }}
                                                />
                                                <h3 className="text-lg font-medium text-[#1A1A1A]">Pergunta</h3>
                                            </div>

                                            <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#5A5A52]">
                                                {flashcard.pergunta || 'Sem pergunta cadastrada.'}
                                            </p>
                                        </div>

                                        <div
                                            className="absolute inset-0 rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5"
                                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-3 w-3 rounded-full border border-black/10"
                                                    style={{ backgroundColor: flashcard.color_hex || '#F8FF97' }}
                                                />
                                                <h3 className="text-lg font-medium text-[#1A1A1A]">Resposta</h3>
                                            </div>

                                            <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#5A5A52]">
                                                {flashcard.resposta || 'Sem resposta cadastrada.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* BUG FIX: Botões de ação só renderizados se os handlers forem fornecidos */}
                                    {(onEditClick || onDeleteClick) && (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {onEditClick && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onEditClick(flashcard)
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
                                                        onDeleteClick(flashcard)
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
