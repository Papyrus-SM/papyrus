import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <section className="px-6 py-10 md:px-10 lg:px-20">
                <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#E8E8DF] pb-6">
                    <a
                        href="/"
                        className="font-serif-display text-xl tracking-[-0.02em] text-[#1A1A1A]"
                    >
                        Papyrus
                    </a>

                    <a
                        href="/login"
                        className="text-sm text-[#5A5A5A] transition hover:text-[#1A1A1A]"
                    >
                        Entrar
                    </a>
                </div>
            </section>

            <section className="px-6 pb-16 pt-6 md:px-10 lg:px-20">
                <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
                    <div className="relative">
                        <div className="absolute -top-10 left-0 hidden md:block">
                        </div>

                        <div className="relative z-10 max-w-xl">
                            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A80]">
                                Registro
                            </p>

                            <h1 className="font-serif-display text-[clamp(42px,6vw,72px)] leading-[1.05] tracking-[-0.03em]">
                                Sua rotina de estudos, em ordem.
                            </h1>

                            <p className="mt-6 max-w-[480px] text-[17px] font-light leading-[1.75] text-[#5A5A52]">
                                Crie sua conta para começar a organizar matérias, metas,
                                calendário e métodos de estudo com clareza e consistência.
                            </p>

                            <div className="mt-10 space-y-4 text-sm text-[#5A5A52]">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-[#CBCBC2]" />
                                    <span>Organização acadêmica em um só lugar</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-[#CBCBC2]" />
                                    <span>Planejamento com calendário, metas e rotina</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-[#CBCBC2]" />
                                    <span>Ambiente limpo, sóbrio e focado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <RegisterForm />
                    </div>
                </div>
            </section>
        </main>
    )
}