"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { gerarRelatorio } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaginaRelatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("")
  const [mes, setMes] = useState("")
  const [ano, setAno] = useState("")
  const { toast } = useToast()

  const handleGerarRelatorio = async () => {
    try {
      const relatorio = await gerarRelatorio(tipoRelatorio, mes, ano)
      // Aqui você normalmente iniciaria o download do relatório
      toast({
        title: "Relatório gerado com sucesso",
        description: "Seu relatório está pronto para download.",
      })
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Houve um erro ao gerar o relatório. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerar Relatórios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipoRelatorio">Tipo de Relatório</Label>
              <Select onValueChange={setTipoRelatorio} value={tipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Relatório Mensal</SelectItem>
                  <SelectItem value="anual">Relatório Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mes">Mês</Label>
              <Select onValueChange={setMes} value={mes}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Select onValueChange={setAno} value={ano}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const ano = new Date().getFullYear() - i
                    return (
                      <SelectItem key={ano} value={ano.toString()}>
                        {ano}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGerarRelatorio}>Gerar Relatório</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

