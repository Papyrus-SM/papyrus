export default function PlaceholderSection() {
    return (
        <section
            id="em-criacao"
            className="border-t border-[#E8E8DF] px-6 py-24 text-center md:px-10 lg:px-20"
        >
            <div className="inline-flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#CBCBC2]" />
                <span className="text-[13px] tracking-[0.08em] text-[#8A8A80]">
          EM CRIAÇÃO
        </span>
                <div className="h-1.5 w-1.5 rounded-full bg-[#CBCBC2]" />
            </div>

            <p className="mt-3 text-[15px] font-light text-[#AAAAA0]">
                Esta seção estará disponível nas próximas sprints.
            </p>
        </section>
    )
}