"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buscarPasseiosAgendados } from "@/lib/api"
import { addMonths, format } from "date-fns"
import { ptBR } from "date-fns/locale"

type Passeio = {
  id: string
  data: string
  passeio: string
  cliente: string
  vendedor: string
  hotel: string
  pax: number
}

export function CalendarioPasseios() {
  const [passeios, setPasseios] = useState<Passeio[]>([])
  const [mesAtual, setMesAtual] = useState(new Date())

  const carregarPasseios = async (data: Date) => {
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1)
    const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0)
    const passeiosAgendados = await buscarPasseiosAgendados(inicio.toISOString(), fim.toISOString())
    setPasseios(passeiosAgendados)
  }

  const handleMonthChange = (novaData: Date) => {
    setMesAtual(novaData)
    carregarPasseios(novaData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Passeios</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          locale={ptBR}
          month={mesAtual}
          onMonthChange={handleMonthChange}
          className="rounded-md border"
          modifiers={{
            booked: (date) => passeios.some((passeio) => new Date(passeio.data).toDateString() === date.toDateString()),
          }}
          modifiersStyles={{
            booked: { backgroundColor: "rgba(0, 120, 255, 0.1)", color: "#0078ff", fontWeight: "bold" },
          }}
          components={{
            DayContent: ({ date }) => {
              const passeioDoDia = passeios.filter(
                (passeio) => new Date(passeio.data).toDateString() === date.toDateString(),
              )
              return (
                <div className="flex flex-col items-center">
                  <span>{date.getDate()}</span>
                  {passeioDoDia.length > 0 && (
                    <Badge variant="secondary" className="mt-1">
                      {passeioDoDia.length}
                    </Badge>
                  )}
                </div>
              )
            },
          }}
        />
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Próximos Passeios:</h3>
          <ul className="space-y-2">
            {passeios.slice(0, 5).map((passeio) => (
              <li key={passeio.id} className="flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{passeio.passeio}</span>
                  <span>{format(new Date(passeio.data), "dd/MM/yyyy")}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Cliente: {passeio.cliente}</span>
                  <span className="mx-2">|</span>
                  <span>Hotel: {passeio.hotel || "Não informado"}</span>
                  <span className="mx-2">|</span>
                  <span>Pax: {passeio.pax}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

