import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { validateSession } from '@/services/api/api_usuario.js'

export default function FlashcardsPage() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const bootstrapSession = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem('papyrus_user')
            if (storedUser) {
                try { setUser(JSON.parse(storedUser)) } catch { localStorage.removeItem('papyrus_user') }
            }
            const data = await validateSession()
            if (data?.status !== 'ok') {
                localStorage.removeItem('papyrus_user')
                navigate('/login')
                return
            }
            if (data?.data?.usuario) {
                setUser(data.data.usuario)
                localStorage.setItem('papyrus_user', JSON.stringify(data.data.usuario))
            }
        } catch {
            navigate('/login')
        }
    }, [navigate])

    useEffect(() => { bootstrapSession() }, [bootstrapSession])

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <DashboardSidebar user={user} setUser={setUser} />

                
            </div>
        </main>
    )
}
