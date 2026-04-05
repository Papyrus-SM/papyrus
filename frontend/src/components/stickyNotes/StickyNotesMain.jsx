import { useState } from 'react'
import { deletStickyNotes } from "@/services/api/api_stickyNotes"
import UpdateStickyNote from "../stickyNotes/UpdateStickyNote"

export default function StickyNotesMain({ anotacoes, reload }) {



    async function handleDelete(id) {
        try {
            await deletStickyNotes(id)
            reload()
        }catch (error) {
            console.error("Erro ao deletar", error)
        }
    }

    const [openModal, setOpenModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null)

    async function handleUpdate(anotacao) {
        setSelectedNote(anotacao)
        setOpenModal(true)
    }


    return (
        <>
            <section className="flex flex-wrap gap-6"> {[...anotacoes].reverse().map((anotacao) => ( /* usei o reverse para que os post-its de cima sejam os ultimos criados */
                <div key={anotacao.id} className="stickyNote w-64 h-50 border-[] bg-white px-6 py-4 shadow mx-4 relative group rounded-2xl" style={{ backgroundColor: anotacao.cor }}>
                    <button onClick={() => handleUpdate(anotacao)} className="float-right absolute top-4 left-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg></button>
                    <h2 className="title-sticky-note text-center text-xl pb-2">{anotacao.titulo}</h2>
                    <p className="text-sticky-note line-clamp-6 break-words">{anotacao.texto}</p>
                </div>
            ))}
            </section>

            <div id="modal-form-sticky-notes">
                {openModal && <UpdateStickyNote setOpenModal={setOpenModal} anotacao={selectedNote} reload={reload} />}
            </div>
        </>
    )

}