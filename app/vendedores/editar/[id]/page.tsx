"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buscarVendedor, editarVendedor } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function EditarVendedor() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [vendedor, setVendedor] = useState({ id: "", nome: "", comissao: "" })

  useEffect(() => {
    const carregarVendedor = async () => {
      const dadosVendedor = await buscarVendedor(params.id)
      setVendedor(dadosVendedor)
    }
    carregarVendedor()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await editarVendedor(vendedor)
      toast({
        title: "Vendedor atualizado com sucesso",
        description: `As informações de ${vendedor.nome} foram atualizadas.`,
      })
      router.push("/vendedores")
    } catch (error) {
      toast({
        title: "Erro ao atualizar vendedor",
        description: "Houve um erro ao atualizar o vendedor. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Vendedor</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Vendedor</Label>
              <Input
                id="nome"
                value={vendedor.nome}
                onChange={(e) => setVendedor({ ...vendedor, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comissao">Porcentagem de Comissão</Label>
              <Input
                id="comissao"
                type="number"
                step="0.01"
                value={vendedor.comissao}
                onChange={(e) => setVendedor({ ...vendedor, comissao: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Atualizar Vendedor</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

