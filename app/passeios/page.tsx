"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adicionarPasseio, buscarPasseios, editarPasseio, deletarPasseio, buscarProvedores } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PasseiosMaisVendidos } from "@/components/passeios-mais-vendidos"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaginaPasseios() {
  const [nome, setNome] = useState("")
  const [custo, setCusto] = useState("")
  const [preco, setPreco] = useState("")
  const [passeios, setPasseios] = useState([])
  const [editandoPasseio, setEditandoPasseio] = useState(null)
  const [provedor, setProvedor] = useState("")
  const [provedores, setProvedores] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    carregarPasseios()
    carregarProvedores()
  }, [])

  const carregarPasseios = async () => {
    const dados = await buscarPasseios()
    setPasseios(dados)
  }

  const carregarProvedores = async () => {
    const dados = await buscarProvedores()
    setProvedores(dados)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editandoPasseio) {
        await editarPasseio({
          id: editandoPasseio.id,
          nome,
          custo: Number(custo) || 0,
          precoVenda: Number(preco) || 0,
          provedor,
        })
        toast({
          title: "Passeio atualizado com sucesso",
          description: `${nome} foi atualizado.`,
        })
        setEditandoPasseio(null)
      } else {
        await adicionarPasseio({ nome, custo: Number(custo) || 0, precoVenda: Number(preco) || 0, provedor })
        toast({
          title: "Passeio adicionado com sucesso",
          description: `${nome} foi adicionado à lista de passeios.`,
        })
      }
      setNome("")
      setCusto("")
      setPreco("")
      setProvedor("")
      carregarPasseios()
    } catch (error) {
      toast({
        title: "Erro ao salvar passeio",
        description: "Houve um erro ao salvar o passeio. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEditar = (passeio) => {
    setEditandoPasseio(passeio)
    setNome(passeio.nome)
    setCusto(passeio.custo?.toString() || "")
    setPreco(passeio.precoVenda?.toString() || "")
    setProvedor(passeio.provedor || "")
  }

  const handleDeletar = async (id) => {
    try {
      await deletarPasseio(id)
      toast({
        title: "Passeio deletado com sucesso",
        description: "O passeio foi removido da lista.",
      })
      carregarPasseios()
    } catch (error) {
      toast({
        title: "Erro ao deletar passeio",
        description: "Houve um erro ao deletar o passeio. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Passeios</h1>

      <PasseiosMaisVendidos />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editandoPasseio ? "Editar Passeio" : "Adicionar Novo Passeio"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Passeio</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="custo">Custo</Label>
              <Input
                id="custo"
                type="number"
                step="0.01"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço de Venda</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="provedor">Provedor</Label>
              <Select onValueChange={setProvedor} value={provedor}>
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
            <Button type="submit">{editandoPasseio ? "Atualizar Passeio" : "Adicionar Passeio"}</Button>
            {editandoPasseio && (
              <Button type="button" variant="outline" onClick={() => setEditandoPasseio(null)}>
                Cancelar Edição
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Passeios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Provedor</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Preço de Venda (Individual)</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passeios.map((passeio) => (
                <TableRow key={passeio.id}>
                  <TableCell>{passeio.nome}</TableCell>
                  <TableCell>{passeio.provedor || "Não especificado"}</TableCell>
                  <TableCell>$ {passeio.custo?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell>$ {passeio.precoVenda?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => handleEditar(passeio)}>
                      Editar
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Deletar</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar exclusão</DialogTitle>
                        </DialogHeader>
                        <p>Tem certeza que deseja deletar o passeio "{passeio.nome}"?</p>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => {}}>
                            Cancelar
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeletar(passeio.id)}>
                            Deletar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

