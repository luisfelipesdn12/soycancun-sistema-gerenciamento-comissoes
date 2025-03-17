import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { registrarFeedbackCliente, buscarFeedbacksRecentes } from "@/lib/api"

export function FeedbackCliente() {
  const [vendaId, setVendaId] = useState("")
  const [avaliacao, setAvaliacao] = useState(5)
  const [comentario, setComentario] = useState("")
  const [feedbacksRecentes, setFeedbacksRecentes] = useState([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await registrarFeedbackCliente(vendaId, avaliacao, comentario)
    setVendaId("")
    setAvaliacao(5)
    setComentario("")
    const feedbacks = await buscarFeedbacksRecentes()
    setFeedbacksRecentes(feedbacks)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vendaId">ID da Venda</Label>
            <Input id="vendaId" value={vendaId} onChange={(e) => setVendaId(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="avaliacao">Avaliação (1-5)</Label>
            <Input
              id="avaliacao"
              type="number"
              min="1"
              max="5"
              value={avaliacao}
              onChange={(e) => setAvaliacao(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="comentario">Comentário</Label>
            <Textarea id="comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} required />
          </div>
          <Button type="submit">Enviar Feedback</Button>
        </form>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Feedbacks Recentes</h3>
          <ul className="space-y-2">
            {feedbacksRecentes.map((feedback) => (
              <li key={feedback.id} className="text-sm">
                <strong>{feedback.cliente}</strong> - Avaliação: {feedback.avaliacao}/5
                <p>{feedback.comentario}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

