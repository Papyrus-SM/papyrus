import AuthLayout from '@/components/auth/AuthLayout'
import AuthHero from '@/components/auth/AuthHero'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
    return (
        /*
            Página de registro construída com layout compartilhado.
            Reaproveita a mesma estrutura do login, mudando apenas o conteúdo.
        */
        <AuthLayout
            topBarActionHref="/login"
            topBarActionLabel="Entrar"
            leftContent={
                <AuthHero
                    eyebrow="Registro"
                    title="Sua rotina de estudos, em ordem."
                    description="Crie sua conta para começar a organizar matérias, metas, calendário e métodos de estudo com clareza e consistência."
                    items={[
                        'Organização acadêmica em um só lugar',
                        'Planejamento com calendário, metas e rotina',
                        'Ambiente limpo, sóbrio e focado',
                    ]}
                />
            }
            rightContent={<RegisterForm />}
        />
    )
}