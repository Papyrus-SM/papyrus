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
                Visualize os usuários existentes, edite informações essenciais
                e mantenha o controle administrativo da plataforma.
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
                        {usuarios.map((usuario) => (
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
                                className="cursor-pointer rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5 transition hover:-translate-y-px hover:border-[#D4D4CB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-medium text-[#1A1A1A]">
                                        {usuario.nome}
                                    </h3>

                                    <span
                                        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${
                                            usuario.papel === 'admin'
                                                ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                                : 'bg-[#ECECE4] text-[#4E4E47]'
                                        }`}
                                    >
                                        {usuario.papel}
                                    </span>
                                </div>

                                <p className="mt-3 break-all text-sm leading-6 text-[#5A5A52]">
                                    {usuario.email}
                                </p>

                                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#8A8A80]">
                                    Clique para visualizar e editar
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}