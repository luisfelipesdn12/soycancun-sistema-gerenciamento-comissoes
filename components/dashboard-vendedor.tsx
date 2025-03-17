import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { buscarEstatisticasVendedor } from "@/lib/api"

interface DashboardVendedorProps {
  vendedorId: string
  metaMensal: number
  onRefresh: () => Promise<void>
}

export function DashboardVendedor({ vendedorId, metaMensal, onRefresh }: DashboardVendedorProps) {
  const [estatisticas, setEstatisticas] = useState(null)

  useEffect(() => {
    const carregarEstatisticas = async () => {
      const dados = await buscarEstatisticasVendedor(vendedorId)
      setEstatisticas(dados)
      await onRefresh()
    }
    carregarEstatisticas()
  }, [vendedorId, onRefresh])

  if (!estatisticas) return <div className="col-span-4 h-32 flex items-center justify-center">Carregando...</div>

  const progressoMeta = (estatisticas.valorTotalVendas / metaMensal) * 100

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.totalVendas}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            USD {estatisticas.valorTotalVendas ? estatisticas.valorTotalVendas.toFixed(2) : "0.00"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">USD {estatisticas.comissaoTotal.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meta Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">USD {metaMensal.toFixed(2)}</div>
          <Progress value={progressoMeta} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">{progressoMeta.toFixed(2)}% atingido</p>
        </CardContent>
      </Card>
    </>
  )
}

