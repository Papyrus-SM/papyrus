import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import StickyNotesHeader from '@/components/stickyNotes/StickyNotesHeader'
import StickyNotesMain from '@/components/stickyNotes/StickyNotesMain'
import { getStickyNotes } from '@/services/api/api_stickyNotes'

export default function StickyNotesPage() {
    const [user, setUser] = useState(null)
    const [anotacoes, setAnotacoes] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const storedUser = localStorage.getItem('papyrus_user')

        if (!storedUser) {
            navigate('/login')
            return
        }

        try {
            setUser(JSON.parse(storedUser))
        } catch {
            localStorage.removeItem('papyrus_user')
            navigate('/login')
        }
    }, [navigate])

    useEffect(() => { /* useEffect é um hook do React que permite executar código em momentos específicos do ciclo de vida do componente. Aqui, ele é usado para carregar as notas adesivas quando o componente é montado. */
        async function carregarNotas() {
            try {
                const data = await getStickyNotes()
                setAnotacoes(data)
            } catch (error) {
                console.error("Erro ao buscar notas:", error)
            }
        }

        carregarNotas()
    }, [])

    async function loadNotes() {
        const data = await getStickyNotes()
        setAnotacoes(data)
    }

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <DashboardSidebar user={user} setUser={setUser} />

                <div className="min-h-screen flex-1">
                    <StickyNotesHeader reload={loadNotes} />

                    <div className="px-8 py-8">
                        <StickyNotesMain anotacoes={anotacoes} reload={loadNotes}/> {/* aqui passa as anotacoes para o componente que vai mostrar elas na tela */}
                    </div>
                </div>
            </div>
        </main>
    )
}