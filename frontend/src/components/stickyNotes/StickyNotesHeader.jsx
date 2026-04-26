import { useState } from 'react'
import FormStickyNote from "./FormStickyNote"

export default function StickyNotesHeader({ reload }) {
    const [openModal, setOpenModal] = useState(false);
    return (
        <header className="flex items-center justify-between border-b border-[#E8E8DF] px-8 py-6">
            <div className="w-full">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                    Anotações
                </p>
                <h1 className="mt-2 float-left font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">
                    Crie suas notas
                </h1>
                <button className="float-right rounded-lg p-4 shadow-md cursor-pointer" onClick={() => setOpenModal(true)}>
                    + nova nota
                </button>
            </div>
            <div id="modal-form-sticky-notes">
                {openModal && <FormStickyNote setOpenModal={setOpenModal} reload={reload}/>}
            </div>
        </header>
    )
}