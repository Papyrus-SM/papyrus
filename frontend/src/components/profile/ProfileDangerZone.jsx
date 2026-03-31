export default function ProfileDangerZone({ onDelete, isDeleting }) {
    return (
        <div className="rounded-2xl border border-[#F0D6D6] bg-[#FFF8F8] px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#B06A6A]">
                Zona sensível
            </p>

            <p className="mt-3 text-sm leading-7 text-[#7A4E4E]">
                Excluir sua conta removerá seu acesso atual. Mais para frente, essa área poderá incluir confirmações extras.
            </p>

            <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="mt-4 rounded-xl border border-[#E7BDBD] bg-white px-4 py-3 text-sm text-[#8A4F4F] transition hover:bg-[#FFF1F1] disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isDeleting ? 'Excluindo...' : 'Excluir conta'}
            </button>
        </div>
    )
}