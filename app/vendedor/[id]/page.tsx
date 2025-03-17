"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  buscarVendedor,
  buscarPasseiosMaisVendidosPorVendedor,
  buscarVendasPorVendedor,
  gerarRelatorioVendedor,
} from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PainelVendedor() {
  const params = useParams()
  const [vendedor, setVendedor] = useState(null)
  const [passeiosMaisVendidos, setPasseiosMaisVendidos] = useState([])
  const [vendas, setVendas] = useState([])
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  useEffect(() => {
    const carregarDados = async () => {
      const dadosVendedor = await buscarVendedor(params.id)
      const dadosPasseios = await buscarPasseiosMaisVendidosPorVendedor(params.id)
      const dadosVendas = await buscarVendasPorVendedor(params.id)
      setVendedor(dadosVendedor)
      setPasseiosMaisVendidos(dadosPasseios)
      setVendas(dadosVendas)
    }
    carregarDados()
  }, [params.id])

  const handleGerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      alert("Por favor, selecione um intervalo de datas.")
      return
    }
    try {
      const relatorio = await gerarRelatorioVendedor(params.id, dataInicio, dataFim)
      console.log("Relatório gerado:", relatorio)
      alert("Relatório gerado com sucesso! O download começará em breve.")
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      alert("Erro ao gerar relatório. Por favor, tente novamente.")
    }
  }

  if (!vendedor) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel de {vendedor.nome}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Comissão Total: $ {vendedor.comissaoTotal.toFixed(2)}</p>
          <p>Total de Vendas: {vendedor.totalVendas}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passeios Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={passeiosMaisVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Passeio</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.slice(0, 10).map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>{new Date(venda.data).toLocaleDateString()}</TableCell>
                  <TableCell>{venda.nomeCliente}</TableCell>
                  <TableCell>{venda.passeio}</TableCell>
                  <TableCell>{venda.quantidade}</TableCell>
                  <TableCell>$ {venda.valorTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleGerarRelatorio}>Gerar Relatório</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

