"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buscarTodasVendas } from "@/lib/api"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export default function PasseiosVendidos() {
  const [vendas, setVendas] = useState([])
  const [filteredVendas, setFilteredVendas] = useState([])
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const carregarVendas = async () => {
      const todasVendas = await buscarTodasVendas()
      setVendas(todasVendas)
      setFilteredVendas(todasVendas)
    }
    carregarVendas()
  }, [])

  useEffect(() => {
    const filtered = vendas.filter((venda) => {
      const vendaDate = new Date(venda.data)
      const isInDateRange = vendaDate >= dateRange.from && vendaDate <= dateRange.to
      const matchesSearch =
        venda.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.passeio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
      return isInDateRange && matchesSearch
    })
    setFilteredVendas(filtered)
  }, [dateRange, searchTerm, vendas])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Passeios Vendidos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="dateRange">Período:</Label>
            <DateRangePicker onRangeChange={setDateRange} />
          </div>
          <div>
            <Label htmlFor="search">Buscar:</Label>
            <Input
              id="search"
              placeholder="Buscar por cliente, passeio ou vendedor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Passeios Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Passeio</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>{new Date(venda.data).toLocaleDateString()}</TableCell>
                  <TableCell>{venda.nomeCliente}</TableCell>
                  <TableCell>{venda.vendedor}</TableCell>
                  <TableCell>{venda.passeio}</TableCell>
                  <TableCell>{venda.quantidade}</TableCell>
                  <TableCell>$ {venda.valorTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

