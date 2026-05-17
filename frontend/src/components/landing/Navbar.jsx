const navItems = [
    { label: 'Métodos de estudo', id: 'metodos-de-estudo' },
    { label: 'Organização', id: 'organizacao' },
]

export default function Navbar({ onNavigate }) {
    function handleNavigate(id) {
        if (id === 'topo') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
            return
        }

        onNavigate(id)
    }

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#E8E8DF] bg-[rgba(250,250,247,0.85)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-20">
                <button
                    type="button"
                    onClick={() => handleNavigate('topo')}
                    className="cursor-pointer font-serif-display text-xl tracking-[-0.02em] text-[#1A1A1A] transition-colors duration-200 hover:text-[#5A5A5A]"
                >
                    Papyrus
                </button>

                <div className="hidden items-center gap-9 md:flex">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => handleNavigate(item.id)}
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