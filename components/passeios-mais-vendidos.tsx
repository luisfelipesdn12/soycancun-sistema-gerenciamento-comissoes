import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { buscarPasseiosMaisVendidosMensal } from "@/lib/api"

export function PasseiosMaisVendidos() {
  const [dados, setDados] = useState([])

  useEffect(() => {
    const carregarDados = async () => {
      const passeiosMaisVendidos = await buscarPasseiosMaisVendidosMensal()
      setDados(passeiosMaisVendidos)
    }
    carregarDados()
  }, [])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Passeios Mais Vendidos do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="vendas" fill="#8884d8" name="Quantidade de Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

