import { useEffect } from 'react'

export default function FeedbackToast({
                                          open,
                                          type = 'success',
                                          message,
                                          onClose,
                                      }) {
    useEffect(() => {
        if (!open) return

        const timer = setTimeout(() => {
            onClose?.()
        }, 3500)

        return () => clearTimeout(timer)
    }, [open, onClose])

    if (!open || !message) return null

    const isError = type === 'error'

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-[140] max-w-sm rounded-2xl border px-4 py-3 shadow-xl backdrop-blur"
        >
            <div
                className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                    isError
                        ? 'border border-[#E7C7C7] bg-[#FFF5F5] text-[#7A2E2E]'
                        : 'border border-[#DDE8D8] bg-[#F5FBF3] text-[#2F5E2F]'
                }`}
            >
                <div className="flex items-start justify-between gap-4">
                    <p>{message}</p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs opacity-70 transition hover:opacity-100"
                        aria-label="Fechar mensagem"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}