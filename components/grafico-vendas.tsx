import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { buscarTendenciasVendas } from "@/lib/api"

interface GraficoVendasProps {
  onRefresh: () => Promise<void>
}

export function GraficoVendas({ onRefresh }: GraficoVendasProps) {
  const [periodo, setPeriodo] = useState<"diario" | "semanal" | "mensal">("diario")
  const [dados, setDados] = useState([])

  useEffect(() => {
    const carregarDados = async () => {
      const tendencias = await buscarTendenciasVendas(periodo)
      setDados(tendencias)
      await onRefresh()
    }
    carregarDados()
  }, [periodo, onRefresh])

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tendências de Vendas</CardTitle>
          <Select value={periodo} onValueChange={(value: "diario" | "semanal" | "mensal") => setPeriodo(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diário</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="vendas" fill="#8884d8" name="Número de Vendas" />
            <Bar yAxisId="right" dataKey="valor" fill="#82ca9d" name="Valor Total ($)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

