function formatDate(dateStr) {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`
}

function formatTime(timeStr) {
    if (!timeStr) return null
    const [h, m] = timeStr.split(':')
    return `${h}:${m}`
}

export default function DatePopup({ selectedDate, tarefas, eventos, onClose, onAddTarefa, onAddEvento }) {
    if (!selectedDate) return null

    const dateKey = selectedDate
    const dayTarefas = tarefas.filter(
        (t) => t.data_entrega === dateKey && !t.concluida
    )
    const dayEventos = eventos.filter((e) => e.data_evento === dateKey)

    const hasItems = dayTarefas.length > 0 || dayEventos.length > 0

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-lg rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Calendário</p>
                        <h2 className="mt-3 font-serif-display text-3xl tracking-[-0.03em] text-[#1A1A1A]">
                            {formatDate(selectedDate)}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <div className="mt-6 space-y-3">
                    {!hasItems && (
                        <p className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-6 text-sm leading-7 text-[#5A5A52]">
                            Nenhuma tarefa ou evento para este dia.
                        </p>
                    )}

                    {dayTarefas.length > 0 && (
                        <div>
                            <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Tarefas</p>
                            <div className="space-y-2">
                                {dayTarefas.map((t) => (
                                    <div
                                        key={`t-${t.id}`}
                                        className="flex items-center gap-3 rounded-xl border border-[#E8E8DF] bg-[#FAFAF7] px-4 py-3"
                                    >
                                        <div
                                            className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                                            style={{ backgroundColor: t.materia?.cor || '#F8FF97' }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-[#1A1A1A]">{t.titulo}</p>
                                            <p className="text-xs text-[#8A8A80]">{t.materia?.nome}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {dayEventos.length > 0 && (
                        <div>
                            <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Eventos</p>
                            <div className="space-y-2">
                                {dayEventos.map((e) => (
                                    <div
                                        key={`e-${e.id}`}
                                        className="flex items-center gap-3 rounded-xl border border-[#E8E8DF] bg-[#FAFAF7] px-4 py-3"
                                    >
                                        <div
                                            className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                                            style={{ backgroundColor: e.cor || '#4A90D9' }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-[#1A1A1A]">{e.titulo}</p>
                                            <p className="text-xs text-[#8A8A80]">
                                                {e.hora_evento && formatTime(e.hora_evento)}
                                                {e.local && (e.hora_evento ? ` · ${e.local}` : e.local)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => onAddTarefa(selectedDate)}
                        className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                    >
                        Nova tarefa
                    </button>
                    <button
                        type="button"
                        onClick={() => onAddEvento(selectedDate)}
                        className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]"
                    >
                        Novo evento
                    </button>
                </div>
            </div>
        </div>
    )
}
