export default function ProfileTrigger({ primeiroNome, email, onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="flex w-full items-center justify-between rounded-2xl border border-[#E8E8DF] bg-white px-4 py-4 text-left transition hover:border-[#D8D8CF] hover:bg-[#FCFCF9]"
        >
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#8A8A80]">
                    Perfil
                </p>

                <p className="mt-2 truncate text-sm font-medium text-[#1A1A1A]">
                    {primeiroNome}
                </p>

                <p className="mt-1 truncate text-xs text-[#8A8A80]">
                    {email}
                </p>
            </div>

            <span className="ml-4 text-lg text-[#8A8A80]">+</span>
        </button>
    )
}