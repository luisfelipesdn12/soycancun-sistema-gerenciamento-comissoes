"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adicionarVendedor, buscarVendedores, deletarVendedor } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trash2 } from "lucide-react"

export default function PaginaVendedores() {
  const [nome, setNome] = useState("")
  const [comissao, setComissao] = useState("")
  const [vendedores, setVendedores] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    carregarVendedores()
  }, [])

  const carregarVendedores = async () => {
    const dados = await buscarVendedores()
    setVendedores(dados)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adicionarVendedor({ nome, comissao: Number.parseFloat(comissao) })
      toast({
        title: "Vendedor adicionado com sucesso",
        description: `${nome} foi adicionado à lista de vendedores.`,
      })
      setNome("")
      setComissao("")
      carregarVendedores()
    } catch (error) {
      toast({
        title: "Erro ao adicionar vendedor",
        description: "Houve um erro ao adicionar o vendedor. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeletar = async (id: string) => {
    try {
      await deletarVendedor(id)
      toast({
        title: "Vendedor deletado com sucesso",
        description: "O vendedor foi removido da lista.",
      })
      carregarVendedores()
    } catch (error) {
      toast({
        title: "Erro ao deletar vendedor",
        description: "Houve um erro ao deletar o vendedor. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciar Vendedores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Vendedor</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="comissao">Porcentagem de Comissão</Label>
                <Input
                  id="comissao"
                  type="number"
                  value={comissao}
                  onChange={(e) => setComissao(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Adicionar Vendedor</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Vendedores</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {vendedores.map((vendedor) => (
                <li key={vendedor.id} className="flex justify-between items-center">
                  <span>{vendedor.nome}</span>
                  <div>
                    <Link href={`/vendedor/${vendedor.id}`}>
                      <Button variant="outline" className="mr-2">
                        Ver Painel
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon" onClick={() => handleDeletar(vendedor.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Deletar vendedor</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

