import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import WelcomeCard from '@/components/dashboard/WelcomeCard'

export default function DashboardPage() {
    const [user, setUser] = useState(null)
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

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <DashboardSidebar user={user} setUser={setUser} />

                <div className="min-h-screen flex-1">
                    <DashboardHeader />

                    <div className="px-8 py-8">
                        <WelcomeCard user={user} />
                    </div>
                </div>
            </div>
        </main>
    )
}