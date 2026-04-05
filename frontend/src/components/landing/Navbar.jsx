const navItems = [
    { label: 'Métodos de estudo', id: 'metodos-de-estudo' },
    { label: 'Organização', id: 'organizacao' },
]

export default function Navbar({ onNavigate }) {
    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#E8E8DF] bg-[rgba(250,250,247,0.85)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-20">
        <span className="font-serif-display text-xl tracking-[-0.02em] text-[#1A1A1A]">
          Papyrus
        </span>

                <div className="hidden items-center gap-9 md:flex">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => onNavigate(item.id)}
                            className="cursor-pointer text-sm font-normal text-[#5A5A5A] transition-colors duration-200 hover:text-[#1A1A1A]"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    )
}