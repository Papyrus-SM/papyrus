function getStatusLabel(status) {
    return status === 'bloqueado' ? 'Bloqueado' : 'Ativo'
}

export default function AdminUsersSection({
    usuarios,
    loading,
    onOpenUser,
}) {
    return (
        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                Usuários
            </p>

            <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                Contas cadastradas
            </h2>

            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">
                Visualize os usuários existentes, edite informações essenciais,
                bloqueie contas quando necessário e mantenha o controle
                administrativo da plataforma.
            </p>

            <div className="mt-8">
                {loading && (
                    <p className="text-sm text-[#8A8A80]">
                        Carregando usuários...
                    </p>
                )}

                {!loading && usuarios.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                        <p className="text-sm leading-7 text-[#5A5A52]">
                            Nenhum usuário encontrado.
                        </p>
                    </div>
                )}

                {!loading && usuarios.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {usuarios.map((usuario) => {
                            const isAdmin = usuario.papel === 'admin'
                            const isBlocked = usuario.status_conta === 'bloqueado'

                            return (
                                <article
                                    key={usuario.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onOpenUser(usuario)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault()
                                            onOpenUser(usuario)
                                        }
                                    }}
                                    className={`cursor-pointer rounded-2xl border p-5 transition hover:-translate-y-px hover:border-[#D4D4CB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] ${
                                        isBlocked
                                            ? 'border-[#E7C7C7] bg-[#FFF8F8]'
                                            : 'border-[#E8E8DF] bg-[#FAFAF7]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-medium text-[#1A1A1A]">
                                            {usuario.nome}
                                        </h3>

                                        <div className="flex flex-col items-end gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${
                                                    isAdmin
                                                        ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                                        : 'bg-[#ECECE4] text-[#4E4E47]'
                                                }`}
                                            >
                                                {usuario.papel}
                                            </span>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${
                                                    isBlocked
                                                        ? 'border-[#E7C7C7] bg-[#FBF3F3] text-[#7A2E2E]'
                                                        : 'border-[#CFE7CF] bg-[#EDF7ED] text-[#3F6B3F]'
                                                }`}
                                            >
                                                {getStatusLabel(usuario.status_conta)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="mt-3 break-all text-sm leading-6 text-[#5A5A52]">
                                        {usuario.email}
                                    </p>

                                    <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#8A8A80]">
                                        Clique para visualizar, editar ou bloquear
                                    </p>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
