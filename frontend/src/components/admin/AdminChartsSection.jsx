import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const chartColors = ['#1A1A1A', '#5A5A52', '#8A8A80', '#CFCFC4', '#E8E8DF']

function toNumber(value) {
    const numberValue = Number(value)
    return Number.isNaN(numberValue) ? 0 : numberValue
}

function normalizeChartData(items = []) {
    return items.map((item) => ({
        ...item,
        total: toNumber(item.total),
    }))
}

function EmptyChartMessage({ message }) {
    return (
        <div className="flex h-full min-h-60 items-center justify-center rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8 text-center">
            <p className="text-sm leading-7 text-[#5A5A52]">
                {message}
            </p>
        </div>
    )
}

function ChartCard({ eyebrow, title, description, children }) {
    return (
        <article className="rounded-3xl border border-[#E8E8DF] bg-white p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                {eyebrow}
            </p>

            <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-[#1A1A1A]">
                {title}
            </h3>

            {description && (
                <p className="mt-3 text-sm leading-7 text-[#5A5A52]">
                    {description}
                </p>
            )}

            <div className="mt-6 h-72">
                {children}
            </div>
        </article>
    )
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) return null

    const current = payload[0]
    const name = label || current.name
    const value = current.value

    return (
        <div className="rounded-xl border border-[#E8E8DF] bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-medium text-[#1A1A1A]">
                {name}
            </p>

            <p className="mt-1 text-sm text-[#5A5A52]">
                {value} usuário{value === 1 ? '' : 's'}
            </p>
        </div>
    )
}

function BasicBarChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8DF" />

                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#5A5A52' }}
                />

                <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#5A5A52' }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                    dataKey="total"
                    fill="#1A1A1A"
                    radius={[10, 10, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default function AdminChartsSection({ data, loading }) {
    const generos = normalizeChartData(data?.generos || [])
    const faixasEtarias = normalizeChartData(data?.faixas_etarias || [])
    const usuariosPorPapel = normalizeChartData(data?.usuarios_por_papel || [])
    const cadastrosPorMes = normalizeChartData(data?.cadastros_por_mes || [])

    const hasGeneros = generos.some((item) => item.total > 0)
    const hasFaixasEtarias = faixasEtarias.some((item) => item.total > 0)
    const hasUsuariosPorPapel = usuariosPorPapel.some((item) => item.total > 0)
    const hasCadastrosPorMes = cadastrosPorMes.some((item) => item.total > 0)

    if (loading) {
        return (
            <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                <p className="text-sm text-[#8A8A80]">
                    Carregando gráficos...
                </p>
            </section>
        )
    }

    if (!data) {
        return (
            <section className="rounded-3xl border border-dashed border-[#D9D9D0] bg-white p-8">
                <p className="text-sm leading-7 text-[#5A5A52]">
                    Não foi possível carregar os gráficos do dashboard.
                </p>
            </section>
        )
    }

    return (
        <section className="space-y-8">
            <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                    Gráficos
                </p>

                <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                    Análise visual dos usuários
                </h2>

                <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">
                    Interprete dados demográficos, permissões e crescimento da base
                    de usuários por meio de visualizações simples e objetivas.
                </p>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                    eyebrow="Demografia"
                    title="Distribuição por gênero"
                    description="Proporção de usuários de acordo com o gênero informado no cadastro."
                >
                    {!hasGeneros ? (
                        <EmptyChartMessage message="Ainda não há dados suficientes para exibir a distribuição por gênero." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={generos}
                                    dataKey="total"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={58}
                                    outerRadius={92}
                                    paddingAngle={4}
                                >
                                    {generos.map((item, index) => (
                                        <Cell
                                            key={item.key || item.label}
                                            fill={chartColors[index % chartColors.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard
                    eyebrow="Idade"
                    title="Usuários por faixa etária"
                    description="Agrupamento dos usuários por intervalos de idade calculados pela data de nascimento."
                >
                    {!hasFaixasEtarias ? (
                        <EmptyChartMessage message="Ainda não há dados suficientes para exibir as faixas etárias." />
                    ) : (
                        <BasicBarChart data={faixasEtarias} />
                    )}
                </ChartCard>

                <ChartCard
                    eyebrow="Permissões"
                    title="Total por papel"
                    description="Comparação entre usuários estudantes e administradores cadastrados."
                >
                    {!hasUsuariosPorPapel ? (
                        <EmptyChartMessage message="Ainda não há dados suficientes para exibir o total por papel." />
                    ) : (
                        <BasicBarChart data={usuariosPorPapel} />
                    )}
                </ChartCard>

                <ChartCard
                    eyebrow="Crescimento"
                    title="Cadastros por mês"
                    description="Evolução mensal da quantidade de usuários cadastrados na plataforma."
                >
                    {!hasCadastrosPorMes ? (
                        <EmptyChartMessage message="Ainda não há dados suficientes para exibir os cadastros por mês." />
                    ) : (
                        <BasicBarChart data={cadastrosPorMes} />
                    )}
                </ChartCard>
            </div>

            {hasGeneros && (
                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-6 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                        Legenda
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        {generos.map((item, index) => (
                            <div
                                key={item.key || item.label}
                                className="inline-flex items-center gap-2 rounded-full border border-[#E8E8DF] bg-[#FAFAF7] px-4 py-2"
                            >
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                                />

                                <span className="text-sm text-[#4E4E47]">
                                    {item.label}: {item.total}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </section>
    )
}