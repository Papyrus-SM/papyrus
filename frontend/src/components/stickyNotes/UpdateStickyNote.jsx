import { useState } from "react"
import { updateStickyNotes } from "@/services/api/api_stickyNotes"
import FormFeedback from "../auth/FormFeedback";


export default function UpdateStickyNote({setOpenModal, anotacao, reload}) {

    const initialStickyNote = {
        id: anotacao.id,
        titulo: anotacao.titulo,
        //nome: '', // ======================================
        anotacao:  anotacao.texto,
        cor: anotacao.cor,
    }

    const [formData, setFormData] = useState(initialStickyNote)

    /* estado antes do envio */
    const [loading, setLoading] = useState(false)

    console.log(loading)

    /* msg sucesso ou erro */
    const [feedback, setFeedback] = useState({
        type: '',
        mensagem: '',
    })

    /* atualiza o que esta escrito nas anotacoes conforme é anotado */
    function handleChange(e) {
        const { name, value } = e.target; /* pega o nome do campo e o valor digitado */
        setFormData((prev) => ({
            ...prev, /* previa os dados anteriores */
            [name]: value, /* atualiza o campo específico com o valor digitado */
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true) /* ativa o estado de carregamento */
        setFeedback({ type: '', message: '' }) /* limpa mensagens anteriores */

        const payload = {
            titulo: formData.titulo.trim(),
            // nome: formData.nome.trim(), =================================
            anotacao: formData.anotacao,
        }

        if(payload.titulo && payload.anotacao.trim() === '') {
            setFeedback({
                type: 'error',
                message: 'Esta vaziu!'
            })
            return
        }

        /* =========================================
        if (!payload.nome.includes('A')) {
            setFeedback({
                type: 'error',
                message: 'Nome não contem A',
            })
            return
        }
            */

        try {
            const data = await updateStickyNotes(formData); /* aqui envia os dados e pega o retorno do envio */

            if (data.status === "ok") {
                setFeedback({
                    type: "success",
                    message: data.mensagem || "Nota alterada.",
                });

                setFormData(initialStickyNote);

                reload();

                setOpenModal(false)
            } else {
                setFeedback({
                    type: "error",
                    message: data.mensagem || "Erro",
                });
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <>
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="bg-white w-xl flex flex-col p-8 rounded-md">
                    <button onClick={() => {setOpenModal(false)}} className="self-end p-4 absolute text-xl cursor-pointer">X</button>
                    <h1 className="mt-2 font-serif-display text-4xl text-center py-2 tracking-[-0.03em] text-[#1A1A1A]">
                        Editar Nota
                    </h1>
                    <label htmlFor="titulo" className="p-2">Titulo</label>
                    <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="p-2 bg-gray-400/20 rounded-md" id="titulo" placeholder="Titulo"/>

{/* =====================================================
                    <label htmlFor="nome" className="p-2">nome</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="p-2 bg-gray-400/20 rounded-md" id="nome" placeholder="Insira seu nome"/>
*/}

                    <label htmlFor="anotacao" className="p-2">Anotação</label>
                    <textarea name="anotacao" value={formData.anotacao} onChange={handleChange} className="p-2 bg-gray-400/20 rounded-md" id="anotacao" cols="30" rows="10" placeholder="Escreva sua nota aqui....."></textarea>

                    <FormFeedback type={feedback.type} message={feedback.message} />

                    <div className="flex gap-3 mt-4">

                        {["#ffffff", "#fdf28e", "#fc9791", "#abffae", "#aed9ff", "#e287e4"].map((cor) =>(
                            <label key={cor} className="cursor-pointer">
                                <input type="radio" name="cor" value={cor} checked={formData.cor === cor} className="hidden" onChange={handleChange} />
                                <div className={`w-10 h-10 rounded-full border-1 transition ${formData.cor === cor ? "border-black scale-110": "border-gray-300"}`} style={{backgroundColor: cor}} />
                            </label>
                        ))}

                    </div>

                    <button type="submit" className="p-2 mt-4 w-40 bg-green-300/80 rounded-full self-end cursor-pointer">Salvar</button>
                </form>
            </div>
        </>
    )
}