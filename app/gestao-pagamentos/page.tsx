"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { adicionarTransacao, buscarTransacoes, calcularBalanco, buscarVendedores } from "@/lib/api"
import { format, startOfMonth, endOfMonth } from "date-fns"

export default function GestaoPagamentos() {
  const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 })
  const [dateRange, setDateRange] = useState({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
  const [transactionType, setTransactionType] = useState("income")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [clientName, setClientName] = useState("")
  const [vendorName, setVendorName] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [sellers, setSellers] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const startDate = format(dateRange.from, "yyyy-MM-dd")
      const endDate = format(dateRange.to, "yyyy-MM-dd")
      const fetchedTransactions = await buscarTransacoes(startDate, endDate)
      const fetchedBalance = await calcularBalanco(startDate, endDate)
      const fetchedSellers = await buscarVendedores()
      setTransactions(fetchedTransactions)
      setBalance(fetchedBalance)
      setSellers(fetchedSellers)
    }
    fetchData()
  }, [dateRange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const transaction = {
        date: format(new Date(), "yyyy-MM-dd"),
        amount: Number(amount),
        type: transactionType as "income" | "expense",
        description,
        clientName: transactionType === "income" ? clientName : undefined,
        vendorName: transactionType === "expense" ? vendorName : undefined,
        sellerName: transactionType === "income" ? sellerName : undefined,
      }
      await adicionarTransacao(transaction)
      toast({ title: "Transação adicionada com sucesso" })
      // Refresh data
      const startDate = format(dateRange.from, "yyyy-MM-dd")
      const endDate = format(dateRange.to, "yyyy-MM-dd")
      const updatedTransactions = await buscarTransacoes(startDate, endDate)
      const updatedBalance = await calcularBalanco(startDate, endDate)
      setTransactions(updatedTransactions)
      setBalance(updatedBalance)
      // Reset form
      setAmount("")
      setDescription("")
      setClientName("")
      setVendorName("")
      setSellerName("")
    } catch (error) {
      toast({ title: "Erro ao adicionar transação", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestão de Pagamentos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transactionType">Tipo de Transação</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            {transactionType === "income" && (
              <>
                <div>
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="sellerName">Vendedor</Label>
                  <Select value={sellerName} onValueChange={setSellerName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.nome}>
                          {seller.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {transactionType === "expense" && (
              <div>
                <Label htmlFor="vendorName">Nome do Fornecedor</Label>
                <Input id="vendorName" value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
              </div>
            )}
            <Button type="submit">Adicionar Transação</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balanço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Período</Label>
              <DateRangePicker onRangeChange={setDateRange} />
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Entradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">$ {balance.income.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Saídas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">$ {balance.expenses.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Saldo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">$ {balance.balance.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Cliente/Fornecedor</TableHead>
                <TableHead>Vendedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{transaction.type === "income" ? "Entrada" : "Saída"}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                    $ {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.clientName || transaction.vendorName}</TableCell>
                  <TableCell>{transaction.sellerName || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

