export default function HeroActions() {
    return (
        <div className="flex min-w-[280px] flex-col gap-3">
            <div data-animate className="animate-on-scroll">
                <p className="mb-4 text-[13px] font-normal text-[#8A8A80]">
                    Comece agora — é gratuito
                </p>

                <button
                    onClick={() => (window.location.href = '/register')}
                    className="w-full rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-8 py-3.5 text-center text-[15px] font-medium tracking-[0.01em] text-[#FAFAF7] transition duration-200 hover:-translate-y-[1px] hover:bg-[#2E2E2E]"
                >
                    Começar agora
                </button>
            </div>

            <div data-animate className="animate-on-scroll">
                <button
                    onClick={() => (window.location.href = '/login')}
                    className="w-full rounded-xl border border-[#CBCBC2] bg-transparent px-8 py-3.5 text-center text-[15px] font-normal tracking-[0.01em] text-[#1A1A1A] transition duration-200 hover:-translate-y-[1px] hover:border-[#1A1A1A] hover:bg-[#F0F0E8]"
                >
                    Já tenho uma conta
                </button>
            </div>
        </div>
    )
}