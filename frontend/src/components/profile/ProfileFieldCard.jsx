export default function ProfileFieldCard({
                                             label,
                                             value,
                                             isEditing = false,
                                             inputValue = '',
                                             inputPlaceholder = '',
                                             onInputChange,
                                             onEdit,
                                             onSave,
                                             onCancel,
                                             isSaving = false,
                                             readOnly = false,
                                         }) {
    return (
        <div className="rounded-2xl border border-[#E8E8DF] bg-white px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#8A8A80]">
                {label}
            </p>

            {isEditing ? (
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={onInputChange}
                        placeholder={inputPlaceholder}
                        className="w-full rounded-xl border border-[#D8D8CF] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                    />

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={isSaving}
                            className="rounded-xl bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSaving}
                            className="rounded-xl border border-[#D8D8CF] bg-transparent px-4 py-3 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:bg-[#ECECE4] hover:text-[#1A1A1A]"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-[#1A1A1A]">
                        {value}
                    </p>

                    {!readOnly && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="rounded-xl border border-[#D8D8CF] bg-[#FAFAF7] px-4 py-2 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:bg-[#ECECE4] hover:text-[#1A1A1A]"
                        >
                            Editar
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}