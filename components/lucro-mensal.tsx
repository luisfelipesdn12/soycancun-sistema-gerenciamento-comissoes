import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { buscarLucroMensal } from "@/lib/api"

export function LucroMensal() {
  const [ano, setAno] = useState(new Date().getFullYear().toString())
  const [dados, setDados] = useState([])

  useEffect(() => {
    const carregarDados = async () => {
      const lucroMensal = await buscarLucroMensal(ano)
      setDados(lucroMensal)
    }
    carregarDados()
  }, [ano])

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lucro Mensal</CardTitle>
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lucro" fill="#8884d8" name="Lucro (USD)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

