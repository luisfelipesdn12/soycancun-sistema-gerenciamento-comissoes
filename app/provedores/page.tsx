"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  buscarPasseiosPorProvedor,
  buscarPagamentosPendentes,
  adicionarProvedor,
  buscarProvedores,
  editarProvedor,
  deletarProvedor,
} from "@/lib/api"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2 } from "lucide-react"

export default function PaginaProvedores() {
  const [provedorSelecionado, setProvedorSelecionado] = useState("aquaworld")
  const [dataInicio, setDataInicio] = useState(new Date())
  const [dataFim, setDataFim] = useState(new Date())
  const [passeios, setPasseios] = useState([])
  const [pagamentosPendentes, setPagamentosPendentes] = useState({ totalPago: 0, pendente: 0, total: 0 })
  const [novoProvedor, setNovoProvedor] = useState({ nome: "", contato: "" })
  const [provedores, setProvedores] = useState([])
  const [editandoProvedor, setEditandoProvedor] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const carregarDados = async () => {
      const dadosPasseios = await buscarPasseiosPorProvedor(provedorSelecionado, dataInicio, dataFim)
      const dadosPagamentos = await buscarPagamentosPendentes(provedorSelecionado, dataInicio, dataFim)
      const listaProvedores = await buscarProvedores()
      setPasseios(dadosPasseios)
      setPagamentosPendentes(dadosPagamentos)
      setProvedores(listaProvedores)
    }
    carregarDados()
  }, [provedorSelecionado, dataInicio, dataFim])

  const handleDateRangeChange = (range) => {
    setDataInicio(range.from)
    setDataFim(range.to)
  }

  const handleStatusPagamento = (passeioId, novoStatus, novoMetodoPagamento = null) => {
    setPasseios((passeiosAtuais) =>
      passeiosAtuais.map((passeio) =>
        passeio.id === passeioId
          ? { ...passeio, status: novoStatus, metodoPagamento: novoMetodoPagamento || passeio.metodoPagamento }
          : passeio,
      ),
    )
    // Aqui você chamaria uma função da API para atualizar o status no backend
    // Por exemplo: atualizarStatusPasseio(passeioId, novoStatus, novoMetodoPagamento)
    toast({
      title: "Status atualizado",
      description: `O status do passeio foi atualizado para ${novoStatus}.`,
    })
  }

  const handleMetodoPagamento = (passeioId, novoMetodo) => {
    setPasseios((passeiosAtuais) =>
      passeiosAtuais.map((passeio) =>
        passeio.id === passeioId ? { ...passeio, metodoPagamento: novoMetodo } : passeio,
      ),
    )
    // Aqui você chamaria uma função da API para atualizar o método de pagamento no backend
    // Por exemplo: atualizarMetodoPagamentoPasseio(passeioId, novoMetodo)
    toast({
      title: "Método de pagamento atualizado",
      description: `O método de pagamento do passeio foi atualizado para ${novoMetodo}.`,
    })
  }

  const handleAdicionarProvedor = async () => {
    try {
      await adicionarProvedor(novoProvedor)
      setNovoProvedor({ nome: "", contato: "" })
      toast({
        title: "Provedor adicionado com sucesso",
        description: `${novoProvedor.nome} foi adicionado à lista de provedores.`,
      })
      const listaProvedores = await buscarProvedores()
      setProvedores(listaProvedores)
    } catch (error) {
      console.error("Erro ao adicionar provedor:", error)
      toast({
        title: "Erro ao adicionar provedor",
        description: "Houve um erro ao adicionar o provedor. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditarProvedor = async (id: string, novoNome: string) => {
    try {
      await editarProvedor(id, novoNome)
      toast({
        title: "Provedor editado com sucesso",
        description: `O nome do provedor foi atualizado para ${novoNome}.`,
      })
      const listaProvedores = await buscarProvedores()
      setProvedores(listaProvedores)
      setEditandoProvedor(null)
    } catch (error) {
      console.error("Erro ao editar provedor:", error)
      toast({
        title: "Erro ao editar provedor",
        description: "Houve um erro ao editar o provedor. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeletarProvedor = async (id: string) => {
    try {
      await deletarProvedor(id)
      toast({
        title: "Provedor deletado com sucesso",
        description: "O provedor foi removido da lista.",
      })
      const listaProvedores = await buscarProvedores()
      setProvedores(listaProvedores)
    } catch (error) {
      console.error("Erro ao deletar provedor:", error)
      toast({
        title: "Erro ao deletar provedor",
        description: "Houve um erro ao deletar o provedor. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestão de Provedores</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label>Provedor</Label>
          <Select value={provedorSelecionado} onValueChange={setProvedorSelecionado}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o provedor" />
            </SelectTrigger>
            <SelectContent>
              {provedores.map((provedor) => (
                <SelectItem key={provedor.id} value={provedor.id}>
                  {provedor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label>Período</Label>
          <DateRangePicker onRangeChange={handleDateRangeChange} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Passeios Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Passeio</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor a Pagar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método de Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passeios.map((passeio) => (
                <TableRow key={passeio.id}>
                  <TableCell>{new Date(passeio.data).toLocaleDateString()}</TableCell>
                  <TableCell>{passeio.nome}</TableCell>
                  <TableCell>{passeio.quantidade} pessoas</TableCell>
                  <TableCell>$ {passeio.valorPagar.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          passeio.status === "pago"
                            ? "bg-green-500"
                            : passeio.status === "pendente"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                      <Select
                        value={passeio.status}
                        onValueChange={(value) => handleStatusPagamento(passeio.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="parcial">Pago Parcial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={passeio.metodoPagamento}
                      onValueChange={(value) => handleMetodoPagamento(passeio.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efetivo">Efetivo</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="balance">Balance</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {passeio.status === "parcial" && (
                      <Input
                        type="number"
                        placeholder="Valor pago"
                        onChange={(e) => handleStatusPagamento(passeio.id, "parcial", Number(e.target.value))}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Pago</p>
              <p className="text-2xl font-bold text-green-700">$ {pagamentosPendentes.totalPago.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pendente</p>
              <p className="text-2xl font-bold text-yellow-700">$ {pagamentosPendentes.pendente.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total do Período</p>
              <p className="text-2xl font-bold text-blue-700">$ {pagamentosPendentes.total.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Provedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provedores.map((provedor) => (
                <TableRow key={provedor.id}>
                  <TableCell>
                    {editandoProvedor === provedor.id ? (
                      <Input
                        value={provedor.nome}
                        onChange={(e) => {
                          const novoNome = e.target.value
                          setProvedores(provedores.map((p) => (p.id === provedor.id ? { ...p, nome: novoNome } : p)))
                        }}
                      />
                    ) : (
                      provedor.nome
                    )}
                  </TableCell>
                  <TableCell>{provedor.contato}</TableCell>
                  <TableCell>
                    {editandoProvedor === provedor.id ? (
                      <>
                        <Button onClick={() => handleEditarProvedor(provedor.id, provedor.nome)} className="mr-2">
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setEditandoProvedor(null)}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditandoProvedor(provedor.id)} className="mr-2">
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="destructive" onClick={() => handleDeletarProvedor(provedor.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Adicionar Novo Provedor</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Provedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomeProvedor">Nome do Provedor</Label>
              <Input
                id="nomeProvedor"
                value={novoProvedor.nome}
                onChange={(e) => setNovoProvedor({ ...novoProvedor, nome: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contatoProvedor">Contato</Label>
              <Input
                id="contatoProvedor"
                value={novoProvedor.contato}
                onChange={(e) => setNovoProvedor({ ...novoProvedor, contato: e.target.value })}
              />
            </div>
            <Button onClick={handleAdicionarProvedor}>Adicionar Provedor</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

