import AuthLayout from '@/components/auth/AuthLayout'
import AuthHero from '@/components/auth/AuthHero'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        /*
            Página de login construída com layout compartilhado.
            A estrutura permanece padronizada e o conteúdo é passado por props.
        */
        <AuthLayout
            topBarActionHref="/register"
            topBarActionLabel="Criar conta"
            leftContent={
                <AuthHero
                    eyebrow="Login"
                    title="Bem-vindo de volta."
                    description="Acesse sua conta e continue organizando sua rotina de estudos."
                />
            }
            rightContent={<LoginForm />}
        />
    )
}