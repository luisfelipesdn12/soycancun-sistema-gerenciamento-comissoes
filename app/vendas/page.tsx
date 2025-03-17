"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adicionarVenda, buscarPasseios, buscarVendedores, buscarVendasPorCliente, buscarProvedores } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, DollarSign, Users, Package, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"

export default function PaginaVendas() {
  const [vendedorId, setVendedorId] = useState("")
  const [data, setData] = useState("")
  const [nomeCliente, setNomeCliente] = useState("")
  const [passeios, setPasseios] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [provedores, setProvedores] = useState([])
  const [clientes, setClientes] = useState([])
  const [itensVenda, setItensVenda] = useState([
    {
      passeioId: "",
      quantidade: 1,
      valorUnitario: "",
      valorTotal: "",
      dataPasseio: "",
      hotel: "",
      balance: "",
      metodoPagamento: "balance",
    },
  ])
  const [vendasPorCliente, setVendasPorCliente] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [saleInfo, setSaleInfo] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const buscarDados = async () => {
      const passeiosData = await buscarPasseios()
      const vendedoresData = await buscarVendedores()
      const provedoresData = await buscarProvedores()
      setPasseios(passeiosData)
      setVendedores(vendedoresData)
      setProvedores(provedoresData)
    }
    buscarDados()
  }, [])

  useEffect(() => {
    const carregarVendasPorCliente = async () => {
      const vendasData = {}
      for (const cliente of clientes) {
        vendasData[cliente] = await buscarVendasPorCliente(cliente)
      }
      setVendasPorCliente(vendasData)
    }
    carregarVendasPorCliente()
  }, [clientes])

  const handleAdicionarItem = () => {
    setItensVenda([
      ...itensVenda,
      {
        passeioId: "",
        quantidade: 1,
        valorUnitario: "",
        valorTotal: "",
        dataPasseio: "",
        hotel: "",
        balance: "",
        metodoPagamento: "balance",
      },
    ])
  }

  const handleRemoverItem = (index) => {
    const novosItens = [...itensVenda]
    novosItens.splice(index, 1)
    setItensVenda(novosItens)
  }

  const handleChangeItem = (index, campo, valor) => {
    const novosItens = [...itensVenda]
    novosItens[index] = { ...novosItens[index], [campo]: valor }

    if (campo === "passeioId") {
      const passeioSelecionado = passeios.find((p) => p.id === valor)
      if (passeioSelecionado && passeioSelecionado.precoVenda) {
        novosItens[index].valorUnitario = passeioSelecionado.precoVenda.toFixed(2)
        novosItens[index].valorTotal = (passeioSelecionado.precoVenda * novosItens[index].quantidade).toFixed(2)
      }
    }

    if (campo === "quantidade" || campo === "valorUnitario") {
      const quantidade = Number(novosItens[index].quantidade)
      const valorUnitario = Number(novosItens[index].valorUnitario)
      novosItens[index].valorTotal = (quantidade * valorUnitario).toFixed(2)
    }

    if (campo === "valorTotal") {
      const quantidade = Number(novosItens[index].quantidade)
      if (quantidade > 0) {
        novosItens[index].valorUnitario = (Number(valor) / quantidade).toFixed(2)
      }
    }

    setItensVenda(novosItens)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const venda = {
        vendedorId,
        data,
        nomeCliente,
        itens: itensVenda
          .filter((item) => item.passeioId !== "")
          .map((item) => ({
            ...item,
            valorUnitario: Number(item.valorUnitario),
            valorTotal: Number(item.valorTotal),
            quantidade: Number(item.quantidade),
            balance: Number(item.balance) || 0,
          })),
      }
      await adicionarVenda(venda)
      toast({
        title: "Venda registrada com sucesso 🎉",
        description: "A venda foi adicionada ao sistema.",
      })

      // Prepare sale info for the pop-up
      const saleInfoData = venda.itens.map((item) => {
        const passeio = passeios.find((p) => p.id === item.passeioId)
        const provedor = provedores.find((p) => p.id === passeio?.provedor)
        return {
          fechaServicio: format(new Date(item.dataPasseio), "dd-MM-yyyy"),
          tour: passeio?.nome || "Passeio Desconhecido",
          pax: item.quantidade,
          nombre: nomeCliente,
          hotel: item.hotel,
          provedor: provedor?.nome || "Provedor Desconhecido",
          balance: item.balance,
        }
      })
      setSaleInfo(saleInfoData)
      setShowPopup(true)

      setVendedorId("")
      setData("")
      setNomeCliente("")
      setItensVenda([
        {
          passeioId: "",
          quantidade: 1,
          valorUnitario: "",
          valorTotal: "",
          dataPasseio: "",
          hotel: "",
          balance: "",
          metodoPagamento: "balance",
        },
      ])

      if (!clientes.includes(nomeCliente)) {
        setClientes([...clientes, nomeCliente])
      }
    } catch (error) {
      toast({
        title: "Erro ao registrar venda ❌",
        description: "Houve um erro ao registrar a venda. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copiado para a área de transferência",
          description: "As informações da venda foram copiadas.",
        })
      },
      (err) => {
        console.error("Erro ao copiar: ", err)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar as informações. Por favor, tente novamente.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Registrar Nova Venda 🛍️</h1>
      </div>

      <Tabs defaultValue={clientes[0] || "nova"} className="w-full">
        <TabsList className="w-full justify-start">
          {clientes.map((cliente) => (
            <TabsTrigger key={cliente} value={cliente}>
              {cliente}
            </TabsTrigger>
          ))}
          <TabsTrigger value="nova">+ Nova Venda</TabsTrigger>
        </TabsList>
        {clientes.map((cliente) => (
          <TabsContent key={cliente} value={cliente}>
            <Card>
              <CardHeader>
                <CardTitle>Vendas de {cliente} 📊</CardTitle>
              </CardHeader>
              <CardContent>
                {vendasPorCliente[cliente]?.map((venda, index) => (
                  <div
                    key={index}
                    className="mb-4 p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-sm"
                  >
                    <div className="grid gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                            Data da Venda: {new Date(venda.data).toLocaleDateString()}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            <Users className="inline-block mr-2 h-4 w-4" />
                            Vendedor: {venda.vendedor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            <DollarSign className="inline-block mr-2 h-4 w-4" />
                            Total: USD {venda.valorTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {venda.itens.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  <Package className="inline-block mr-2 h-4 w-4" />
                                  {item.passeio}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                                  Data do Passeio: {new Date(item.dataPasseio).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  <Users className="inline-block mr-2 h-4 w-4" />
                                  {item.quantidade} {item.quantidade === 1 ? "pessoa" : "pessoas"}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  <DollarSign className="inline-block mr-2 h-4 w-4" />
                                  USD {item.valorVendido.toFixed(2)}
                                </p>
                                {item.balance > 0 && (
                                  <p className="text-sm text-green-600 dark:text-green-400">
                                    <DollarSign className="inline-block mr-2 h-4 w-4" />
                                    Balance: USD {item.balance.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        <TabsContent value="nova">
          <Card>
            <CardHeader>
              <CardTitle>Nova Venda 🆕</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                    <Input
                      id="nomeCliente"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendedor">Vendedor</Label>
                    <Select onValueChange={setVendedorId} value={vendedorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um vendedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendedores.map((vendedor) => (
                          <SelectItem key={vendedor.id} value={vendedor.id}>
                            {vendedor.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data">Data da Venda</Label>
                    <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-4">
                  {itensVenda.map((item, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Passeio {index + 1} 🏖️</CardTitle>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoverItem(index)}
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Passeio</Label>
                            <Select
                              value={item.passeioId}
                              onValueChange={(value) => handleChangeItem(index, "passeioId", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um passeio" />
                              </SelectTrigger>
                              <SelectContent>
                                {passeios.map((passeio) => (
                                  <SelectItem key={passeio.id} value={passeio.id}>
                                    {passeio.nome} - USD {passeio.precoVenda.toFixed(2)}/pessoa
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`quantidade-${index}`}>Quantidade de Pessoas</Label>
                            <Input
                              id={`quantidade-${index}`}
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) => handleChangeItem(index, "quantidade", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor Unitário</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.valorUnitario}
                              onChange={(e) => handleChangeItem(index, "valorUnitario", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor Total</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.valorTotal}
                              onChange={(e) => handleChangeItem(index, "valorTotal", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Data do Passeio</Label>
                            <Input
                              type="date"
                              value={item.dataPasseio}
                              onChange={(e) => handleChangeItem(index, "dataPasseio", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`hotel-${index}`}>Hotel</Label>
                            <Input
                              id={`hotel-${index}`}
                              value={item.hotel || ""}
                              onChange={(e) => handleChangeItem(index, "hotel", e.target.value)}
                              placeholder="Nome do hotel"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`balance-${index}`}>Balance (Pagamento ao Provedor)</Label>
                            <Input
                              id={`balance-${index}`}
                              type="number"
                              step="0.01"
                              value={item.balance || ""}
                              onChange={(e) => handleChangeItem(index, "balance", e.target.value)}
                              placeholder="Valor do balance"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Método de Pagamento</Label>
                            <Select
                              value={item.metodoPagamento}
                              onValueChange={(value) => handleChangeItem(index, "metodoPagamento", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o método de pagamento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="balance">Balance</SelectItem>
                                <SelectItem value="efetivo">Efetivo</SelectItem>
                                <SelectItem value="transferencia">Transferência</SelectItem>
                                <SelectItem value="cartao">Cartão</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleAdicionarItem}>
                    Adicionar Passeio ➕
                  </Button>
                  <Button type="submit">Registrar Venda 💾</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações da Venda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {saleInfo.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <p>
                  <strong>Fecha servicio:</strong> {item.fechaServicio}
                </p>
                <p>
                  <strong>Tour:</strong> {item.tour}
                </p>
                <p>
                  <strong>Pax:</strong> {item.pax}
                </p>
                <p>
                  <strong>Nombre:</strong> {item.nombre}
                </p>
                <p>
                  <strong>Hotel:</strong> {item.hotel}
                </p>
                <p>
                  <strong>Provedor:</strong> {item.provedor}
                </p>
                {item.balance > 0 && (
                  <p>
                    <strong>Balance:</strong> USD {item.balance}
                  </p>
                )}
                <Button
                  onClick={() =>
                    copyToClipboard(
                      `Fecha servicio: ${item.fechaServicio}
Tour: ${item.tour}
Pax: ${item.pax}
Nombre: ${item.nombre}
Hotel: ${item.hotel}
Provedor: ${item.provedor}${item.balance > 0 ? `\nBalance: USD ${item.balance}` : ""}`,
                    )
                  }
                  className="mt-2"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copiar Informações
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

