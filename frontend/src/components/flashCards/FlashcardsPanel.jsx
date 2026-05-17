import { useState } from 'react'

const noop = () => {}
const CARD_FLIP_STYLE = {
    transformStyle: 'preserve-3d',
    transition: 'transform 0.5s ease',
}

// Explicação simples da animação de virar (para leigos):
// Cada flashcard é um cartão com duas faces (frente = pergunta, verso = resposta).
// Para dar o efeito de virar, usamos transformação 3D: rotacionamos no eixo Y.
// - `preserve-3d` mantém as duas faces no mesmo espaço 3D.
// - `transition` anima a mudança de `transform` em 0.5s para parecer suave.
// Quando `transform: 'rotateY(180deg)'` a face de trás fica visível.
// Para acessar/alternar o estado do cartão usamos um `Set` em React, que guarda
// os IDs dos flashcards virados.

export default function FlashcardsPanel({
    flashcards,
    loading,
    onCreateClick = noop,
    onEditClick,
    onDeleteClick,
    loadingDeleteFlashcardId = null,
}) {
    const [flippedFlashcards, setFlippedFlashcards] = useState(() => new Set())

    function toggleFlashcardFlip(flashcardId) {
        setFlippedFlashcards((previous) => {
            const next = new Set(previous)
            if (next.has(flashcardId)) {
                next.delete(flashcardId)
            } else {
                next.add(flashcardId)
            }
            return next
        })
    }

    function handleCardKeyDown(event, flashcardId) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggleFlashcardFlip(flashcardId)
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
                            const flashcardColor = flashcard.color_hex || '#F8FF97'

                            return (
                                <article
                                    key={flashcard.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Flashcard: ${flashcard.pergunta}`}
                                    onClick={() => toggleFlashcardFlip(flashcard.id)}
                                    onKeyDown={(e) => handleCardKeyDown(e, flashcard.id)}
                                    style={{ perspective: 1000 }}
                                    className="rounded-2xl border border-[#E8E8DF] bg-transparent p-5 transition hover:-translate-y-[1px] hover:border-[#D4D4CB] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                >
                                    {/* O container abaixo recebe a transformação 3D que cria
                                        o efeito de virar o cartão. Alteramos `transform`
                                        entre `rotateY(0deg)` (frente) e `rotateY(180deg)` (verso). */}
                                    <div
                                        className="relative h-full min-h-[160px]"
                                        style={{ ...CARD_FLIP_STYLE, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                                    >
                                        <div
                                            className="absolute inset-0 flex flex-col rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5"
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-3 w-3 rounded-full border border-black/10"
                                                    style={{ backgroundColor: flashcardColor }}
                                                />
                                                <h3 className="text-lg font-medium text-[#1A1A1A]">Pergunta</h3>
                                            </div>

                                            <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#5A5A52]">
                                                {flashcard.pergunta || 'Sem pergunta cadastrada.'}
                                            </p>

                                            {(onEditClick || onDeleteClick) && (
                                                <div className="mt-auto flex flex-wrap gap-3">
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
                                        </div>

                                        <div
                                            className="absolute inset-0 flex flex-col rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5"
                                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-3 w-3 rounded-full border border-black/10"
                                                    style={{ backgroundColor: flashcardColor }}
                                                />
                                                <h3 className="text-lg font-medium text-[#1A1A1A]">Resposta</h3>
                                            </div>

                                            <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#5A5A52]">
                                                {flashcard.resposta || 'Sem resposta cadastrada.'}
                                            </p>

                                            {(onEditClick || onDeleteClick) && (
                                                <div className="mt-auto flex flex-wrap gap-3">
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