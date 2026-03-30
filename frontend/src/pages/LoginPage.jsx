import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <section className="px-6 py-10 md:px-10 lg:px-20">
                <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#E8E8DF] pb-6">
                    <a
                        href="/"
                        className="font-serif-display text-xl tracking-[-0.02em]"
                    >
                        Papyrus
                    </a>

                    <a
                        href="/register"
                        className="text-sm text-[#5A5A5A] hover:text-[#1A1A1A]"
                    >
                        Criar conta
                    </a>
                </div>
            </section>

            <section className="px-6 pb-16 pt-6 md:px-10 lg:px-20">
                <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

                    <div className="max-w-xl">
                        <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                            Login
                        </p>

                        <h1 className="font-serif-display text-[clamp(42px,6vw,72px)] leading-[1.05]">
                            Bem-vindo de volta.
                        </h1>

                        <p className="mt-6 text-[17px] text-[#5A5A52]">
                            Acesse sua conta e continue organizando sua rotina de estudos.
                        </p>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <LoginForm />
                    </div>

                </div>
            </section>
        </main>
    )
}