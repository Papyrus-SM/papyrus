import AuthTopBar from './AuthTopBar'

export default function AuthLayout({
                                       topBarActionHref,
                                       topBarActionLabel,
                                       leftContent,
                                       rightContent,
                                   }) {
    return (
        /*
            Layout base compartilhado das páginas de autenticação.
            Centraliza a estrutura visual e aplica:
            - fundo da tela
            - barra superior
            - grid principal com duas colunas em telas maiores
        */
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <AuthTopBar
                actionHref={topBarActionHref}
                actionLabel={topBarActionLabel}
            />

            <section className="px-6 pb-16 pt-6 md:px-10 lg:px-20">
                <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
                    <div>{leftContent}</div>

                    <div className="flex justify-center lg:justify-end">
                        {rightContent}
                    </div>
                </div>
            </section>
        </main>
    )
}