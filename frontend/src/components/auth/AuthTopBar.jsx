export default function AuthTopBar({ actionHref, actionLabel }) {
    return (
        /*
            Barra superior compartilhada das páginas de autenticação.
            Reaproveita a mesma base estrutural da navbar da landing page
            para manter consistência visual entre as telas do projeto.
        */
        <section className="border-b border-[#E8E8DF] bg-[rgba(250,250,247,0.85)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-20">
                <a
                    href="/"
                    className="font-serif-display text-xl tracking-[-0.02em] text-[#1A1A1A]"
                >
                    Papyrus
                </a>

                <a
                    href={actionHref}
                    className="text-sm font-normal text-[#5A5A5A] transition-colors duration-200 hover:text-[#1A1A1A]"
                >
                    {actionLabel}
                </a>
            </div>
        </section>
    )
}