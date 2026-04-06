const noop = () => {}

const DIFICULDADE_LABEL = {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil',
}

const DIFICULDADE_STYLE = {
    facil: 'bg-[#EDFAF0] text-[#1E6B38] border border-[#B8E8C4]',
    medio: 'bg-[#FFF8E6] text-[#7A5A00] border border-[#F0DFA0]',
    dificil: 'bg-[#FBF3F3] text-[#7A2E2E] border border-[#E8C4C4]',
}

function formatDate(dateStr) {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
}

export default function TarefasPanel({
    tarefas,
    loading,
    onCreateClick = noop,
    onEditClick,
    onDeleteClick,
    loadingDeleteTarefaId = null,
}) {
    return (
        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Tarefas</p>
                    <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">Suas tarefas</h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">Aqui ficam as tarefas cadastradas no seu ambiente.</p>
                </div>
                <button
                    type="button"
                    onClick={onCreateClick}
                    className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                >
                    Nova tarefa
                </button>
            </div>

            <div className="mt-8">
                {loading && <p className="text-sm text-[#8A8A80]">Carregando tarefas...</p>}

                {!loading && tarefas.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                        <p className="text-sm leading-7 text-[#5A5A52]">Você ainda não cadastrou nenhuma tarefa.</p>
                    </div>
                )}

                {!loading && tarefas.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tarefas.map((tarefa) => {
                            const isDeleting = loadingDeleteTarefaId === tarefa.id
                            const dificuldadeStyle = DIFICULDADE_STYLE[tarefa.dificuldade] || ''
                            const dificuldadeLabel = DIFICULDADE_LABEL[tarefa.dificuldade] || tarefa.dificuldade

                            return (
                                <article
                                    key={tarefa.id}
                                    className="rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5 transition hover:-translate-y-[1px] hover:border-[#D4D4CB]"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                                                style={{ backgroundColor: tarefa.materia?.cor || '#F8FF97' }}
                                            />
                                            <h3 className="truncate text-lg font-medium text-[#1A1A1A]">{tarefa.titulo}</h3>
                                        </div>
                                        {tarefa.concluida && (
                                            <span className="shrink-0 rounded-full bg-[#EDFAF0] px-2 py-0.5 text-[11px] font-medium text-[#1E6B38] border border-[#B8E8C4]">
                                                Concluída
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-[#8A8A80]">{tarefa.materia?.nome}</p>

                                    <p className="mt-3 min-h-[36px] text-sm leading-6 text-[#5A5A52]">
                                        {tarefa.descricao || 'Sem descrição cadastrada.'}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${dificuldadeStyle}`}>
                                            {dificuldadeLabel}
                                        </span>
                                        {tarefa.data_entrega && (
                                            <span className="rounded-full bg-[#F0F0E8] px-2.5 py-0.5 text-[11px] text-[#5A5A52] border border-[#D9D9D0]">
                                                Entrega: {formatDate(tarefa.data_entrega)}
                                            </span>
                                        )}
                                    </div>

                                    {(onEditClick || onDeleteClick) && (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {onEditClick && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEditClick(tarefa)}
                                                    className="rounded-xl border border-[#CBCBC2] px-4 py-2 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]"
                                                >
                                                    Editar
                                                </button>
                                            )}

                                            {onDeleteClick && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteClick(tarefa)}
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
