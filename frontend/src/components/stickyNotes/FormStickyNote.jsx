import { useState } from "react"
import { registerStickyNotes } from "@/services/api/api_stickyNotes"
import FormFeedback from "../auth/FormFeedback";

const initialStickyNote = {
    titulo: '',
    anotacao: '',
    //teste: '', // ================== Autoria ==========
    cor: '#fdf28e',
}


export default function FormStickyNote({ setOpenModal, reload }) {


    const [formData, setFormData] = useState(initialStickyNote)

    /* estado antes do envio */
    const [loading, setLoading] = useState(false)

    /* msg sucesso ou erro */
    const [feedback, setFeedback] = useState({
        type: '',
        mensagem: '',
    })

    console.log(formData) /* para verificar os dados do formulário em tempo real */
    console.log(loading) /* para verificar o estado de carregamento */
    console.log(feedback) /* para verificar o feedback visual */

    /* atualiza o que esta escrito nas anotacoes conforme é anotado */
    function handleChange(e) {
        const { name, value } = e.target; /* pega o nome do campo e o valor digitado */
        setFormData((prev) => ({
            ...prev, /* previa os dados anteriores */
            [name]: value, /* atualiza o campo específico com o valor digitado */
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault() /* previne o comportamento padrão do formulário, que é recarregar a página */
        setLoading(true) /* ativa o estado de carregamento */
        setFeedback({ type: '', message: '' }) /* limpa mensagens anteriores */

        const payload = {
            titulo: formData.titulo.trim(),
            anotacao: formData.anotacao,
            //teste: formData.teste.trim(),   // ============= Autoria | Teste @ ==========
            cor: formData.cor,
        }

        
        if(!payload.titulo && !payload.anotacao) {
            setFeedback({
                type: 'error',
                message: 'Esta vaziu'
            })
            return
        }


        /* ========= Autoria | Teste @ ===========
        if (!payload.teste.includes('@')) {
            setFeedback({
                type: 'error',
                message: "teste faltou @"
            })
            return
        }

        */

        try {
            const data = await registerStickyNotes(formData); /* aqui envia os dados e pega o retorno do envio */

            if (data.status === "ok") {
                setFeedback({
                    type: "success",
                    message: data.mensagem || "Nota criada.",
                });

                setFormData(initialStickyNote);
                if (reload) reload(); // Recarrega a lista de notas
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
                    <button onClick={() => { setOpenModal(false) }} className="self-end p-4 absolute text-xl cursor-pointer">X</button>
                    <h1 className="mt-2 font-serif-display text-4xl text-center py-2 tracking-[-0.03em] text-[#1A1A1A]">
                        Criar Nota
                    </h1>
                    <label htmlFor="titulo" className="p-2">Titulo</label>
                    <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="p-2 bg-gray-400/20 rounded-md" id="titulo" placeholder="Titulo" />

{/* ================ Autoria | Teste @ =============
                    <label htmlFor="teste" className="p-2">Teste</label>
                    <input type="text" name="teste" value={formData.teste} onChange={handleChange} className="p-2 bg-gray-400/20 rounded-md" id="teste" placeholder="insira" />
*/}
                    <label htmlFor="anotacao" className="p-2">Anotação</label>
                    <textarea name="anotacao" value={formData.anotacao} onChange={handleChange} className="p-2 bg-gray-400/20 rounded-md" id="anotacao" cols="30" rows="10" placeholder="Escreva sua nota aqui....."></textarea>

                    <FormFeedback type={feedback.type} message={feedback.message} />

                    <div className="flex gap-3 mt-4">

                        {["#ffffff", "#fdf28e", "#fc9791", "#abffae", "#aed9ff", "#e287e4"].map((cor) => (
                            <label key={cor} className="cursor-pointer">
                                <input type="radio" name="cor" value={cor} checked={formData.cor === cor} className="hidden" onChange={handleChange} />
                                <div className={`w-10 h-10 rounded-full border-1 transition ${formData.cor === cor ? "border-black scale-110" : "border-gray-300"}`} style={{ backgroundColor: cor }} />
                            </label>
                        ))}

                    </div>

                    <button type="submit" className="p-2 mt-4 w-40 bg-green-300/80 rounded-full self-end cursor-pointer">Salvar</button>
                </form>
            </div>
        </>
    )
}