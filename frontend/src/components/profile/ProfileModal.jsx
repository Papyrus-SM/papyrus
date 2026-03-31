export default function ProfileModal({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-8">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-[rgba(20,20,18,0.42)] backdrop-blur-[2px]"
                aria-label="Fechar menu de perfil"
            />

            <div className="relative z-10 w-full max-w-2xl rounded-[32px] border border-[#E8E8DF] bg-[#FCFCF9] p-8 shadow-[0_24px_80px_rgba(26,26,26,0.16)]">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                            Sua conta
                        </p>

                        <h3 className="mt-3 font-serif-display text-3xl tracking-[-0.03em] text-[#1A1A1A]">
                            Perfil
                        </h3>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#5A5A52]">
                            Visualize seus dados e personalize como deseja ser chamado dentro da plataforma.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8E8DF] bg-white text-lg text-[#6A6A62] transition hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-8 grid gap-4">
                    {children}
                </div>
            </div>
        </div>
    )
}