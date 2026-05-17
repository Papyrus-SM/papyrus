function toNumber(value) {
    const numberValue = Number(value)
    return Number.isNaN(numberValue) ? 0 : numberValue
}

function MetricCard({ label, value, description }) {
    return (
        <article className="rounded-3xl border border-[#E8E8DF] bg-white p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                {label}
            </p>

            <strong className="mt-4 block text-4xl font-medium tracking-[-0.04em] text-[#1A1A1A]">
                {value}
            </strong>

            {description && (
                <p className="mt-3 text-sm leading-6 text-[#5A5A52]">
                    {description}
                </p>
            )}
        </article>
    )
}

function RoleMetricCard({ item }) {
    return (
        <article className="rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                {item.label}
            </p>

            <strong className="mt-3 block text-3xl font-medium tracking-[-0.04em] text-[#1A1A1A]">
                {toNumber(item.total)}
            </strong>
        </article>
    )
}

export default function AdminMetricsSection({ data, loading }) {
    const resumo = data?.resumo || {}
    const usuariosPorPapel = data?.usuarios_por_papel || []

    const totalUsuarios = toNumber(resumo.total_usuarios)
    const totalEstudantes = toNumber(resumo.total_estudantes)
    const totalAdmins = toNumber(resumo.total_admins)

    if (loading) {
        return (
            <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                <p className="text-sm text-[#8A8A80]">
                    Carregando métricas...
                </p>
            </section>
        )
    }

    if (!data) {
        return (
            <section className="rounded-3xl border border-dashed border-[#D9D9D0] bg-white p-8">
                <p className="text-sm leading-7 text-[#5A5A52]">
                    Não foi possível carregar as métricas do dashboard.
                </p>
            </section>
        )
    }

    return (
        <section className="space-y-8">
            <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                    Métricas
                </p>

                <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                    Resumo administrativo
                </h2>

                <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">
                    Visualize os principais números da plataforma de forma rápida,
                    direta e fácil de apresentar.
                </p>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    label="Total de usuários"
                    value={totalUsuarios}
                    description="Quantidade total de contas cadastradas na plataforma."
                />

                <MetricCard
                    label="Estudantes"
                    value={totalEstudantes}
                    description="Usuários com papel de estudante no sistema."
                />

                <MetricCard
                    label="Administradores"
                    value={totalAdmins}
                    description="Contas com permissão de acesso administrativo."
                />
            </div>
        </section>
    )
}