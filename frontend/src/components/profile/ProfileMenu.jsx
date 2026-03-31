import { useEffect, useState } from 'react'
import { deleteUser, editUser } from '@/services/auth'
import ProfileTrigger from '@/components/profile/ProfileTrigger'
import ProfileModal from '@/components/profile/ProfileModal'
import ProfileFieldCard from '@/components/profile/ProfileFieldCard'
import ProfileDangerZone from '@/components/profile/ProfileDangerZone'

export default function ProfileMenu({ user, setUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [displayName, setDisplayName] = useState(user?.nome || '')
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const nomeCompleto = user?.nome || 'Usuário'
    const primeiroNome = nomeCompleto.split(' ')[0]
    const email = user?.email || 'Sem e-mail'

    useEffect(() => {
        setDisplayName(user?.nome || '')
    }, [user])

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                handleClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'auto'
        }
    }, [isOpen, user])

    function handleClose() {
        setIsOpen(false)
        setIsEditing(false)
        setDisplayName(user?.nome || '')
    }

    async function handleSaveName() {
        try {
            setIsSaving(true)

            const resposta = await editUser({
                nome: displayName,
            })

            if (resposta.status !== 'ok') {
                alert(resposta.mensagem || 'Não foi possível atualizar seu perfil.')
                return
            }

            const updatedUser = resposta.data?.usuario || {
                ...user,
                nome: displayName,
            }

            localStorage.setItem('papyrus_user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setIsEditing(false)
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error)
            alert('Não foi possível atualizar seu perfil agora.')
        } finally {
            setIsSaving(false)
        }
    }

    async function handleDeleteAccount() {
        const confirmou = window.confirm(
            'Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.'
        )

        if (!confirmou) {
            return
        }

        try {
            setIsDeleting(true)

            const resposta = await deleteUser()

            if (resposta.status !== 'ok') {
                alert(resposta.mensagem || 'Não foi possível excluir sua conta.')
                return
            }

            localStorage.removeItem('papyrus_user')
            onLogout(true)
        } catch (error) {
            console.error('Erro ao excluir conta:', error)
            alert('Não foi possível excluir sua conta agora.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <ProfileTrigger
                primeiroNome={primeiroNome}
                email={email}
                onOpen={() => setIsOpen(true)}
            />

            {isOpen && (
                <ProfileModal onClose={handleClose}>
                    <ProfileFieldCard
                        label="Nome"
                        value={nomeCompleto}
                        isEditing={isEditing}
                        inputValue={displayName}
                        inputPlaceholder="Como você quer ser chamado"
                        onInputChange={(event) => setDisplayName(event.target.value)}
                        onEdit={() => setIsEditing(true)}
                        onSave={handleSaveName}
                        onCancel={() => {
                            setIsEditing(false)
                            setDisplayName(user?.nome || '')
                        }}
                        isSaving={isSaving}
                    />

                    <ProfileFieldCard
                        label="E-mail"
                        value={email}
                        readOnly={true}
                    />

                    <ProfileDangerZone
                        onDelete={handleDeleteAccount}
                        isDeleting={isDeleting}
                    />
                </ProfileModal>
            )}
        </>
    )
}