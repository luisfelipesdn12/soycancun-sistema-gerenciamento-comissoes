"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardVendedor } from "@/components/dashboard-vendedor"
import { GraficoVendas } from "@/components/grafico-vendas"
import { RankingVendedores } from "@/components/ranking-vendedores"
import { LucroMensal } from "@/components/lucro-mensal"
import { CalendarioPasseios } from "@/components/calendario-passeios"
import { SistemaNotificacoes } from "@/components/sistema-notificacoes"
import { buscarVendedores, buscarMetaGeral, buscarProgressoMetaGeral } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Painel() {
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null)
  const [vendedores, setVendedores] = useState([])
  const [metaMensal, setMetaMensal] = useState(10000)
  const [metaGeral, setMetaGeral] = useState(0)
  const [progressoMetaGeral, setProgressoMetaGeral] = useState(0)

  const refreshDashboard = useCallback(async () => {
    const progressoMeta = await buscarProgressoMetaGeral()
    setProgressoMetaGeral(progressoMeta)
  }, [])

  useEffect(() => {
    const carregarDados = async () => {
      const dadosVendedores = await buscarVendedores()
      setVendedores(dadosVendedores)
      if (dadosVendedores.length > 0) {
        setVendedorSelecionado(dadosVendedores[0].id)
      }

      const metaGeralEmpresa = await buscarMetaGeral()
      setMetaGeral(metaGeralEmpresa)

      await refreshDashboard()
    }
    carregarDados()
  }, [refreshDashboard])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <SistemaNotificacoes />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardVendedor vendedorId={vendedorSelecionado} metaMensal={metaMensal} onRefresh={refreshDashboard} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meta Geral da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">USD {metaGeral.toLocaleString()}</div>
          <Progress value={progressoMetaGeral} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">{progressoMetaGeral.toFixed(2)}% da meta geral atingida</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="lucro">Lucro</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>
        <TabsContent value="vendas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GraficoVendas onRefresh={refreshDashboard} />
            <RankingVendedores onRefresh={refreshDashboard} />
          </div>
        </TabsContent>
        <TabsContent value="lucro">
          <LucroMensal />
        </TabsContent>
        <TabsContent value="calendario">
          <CalendarioPasseios />
        </TabsContent>
      </Tabs>
    </div>
  )
}

