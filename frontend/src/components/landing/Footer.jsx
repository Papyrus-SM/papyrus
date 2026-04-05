export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-[#E8E8DF] bg-[#FAFAF7] px-6 py-14 md:px-10 lg:px-20">
            <div className="mx-auto max-w-6xl">

                {/* Alinhamneto do footer */}
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">

                    {/* Pitch Papyrus footer */}
                    <div className="max-w-[260px]">
                        <span className="mb-3 block font-serif-display text-[20px] tracking-[-0.02em] text-[#1A1A1A]">
                            Papyrus
                        </span>
                        <p className="text-[13px] font-light leading-[1.7] text-[#8A8A80]">
                            Plataforma de organização acadêmica desenvolvida para estudantes
                            que querem estudar com mais método e menos esforço.
                        </p>
                    </div>

                    {/* Plataforma footer mostrando as seções da Landing */}
                    <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
                        <div>
                            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#CBCBC2]">
                                Plataforma
                            </p>
                            <ul className="flex flex-col gap-3">
                                {['Métodos de estudo', 'Anotações', 'Pomodoro'].map((item) => (
                                    <li key={item}>
                                        <span className="text-[13px] font-light text-[#8A8A80] transition-colors hover:text-[#1A1A1A] cursor-default">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/*  */}
                <div className="my-10 border-t border-[#E8E8DF]" />

                {/*  */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12px] font-light text-[#AAAAA0]">
                        © {year} Papyrus — Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-light text-[#CBCBC2]">
                            Engenharia de Software
                        </span>
                        <span className="text-[#CBCBC2]">·</span>
                        <span className="text-[12px] font-medium text-[#8A8A80]">
                            PUCPR
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    )
}
