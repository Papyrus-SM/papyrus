export default function FormFeedback({ type, message }) {
    if (!message) return null

    const styles =
        type === 'success'
            ? 'border-[#D6E7D4] bg-[#F4FAF2] text-[#355B35]'
            : 'border-[#E7D4D4] bg-[#FBF3F3] text-[#7A2E2E]'

    return (
        /*
            Bloco reutilizável de feedback visual.
            Exibe mensagens de sucesso ou erro para o usuário.
        */
        <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
            {message}
        </div>
    )
}