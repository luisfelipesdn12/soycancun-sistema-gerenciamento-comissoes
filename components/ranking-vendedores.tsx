import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buscarRanking } from "@/lib/api"

interface RankingVendedoresProps {
  onRefresh: () => Promise<void>
}

export function RankingVendedores({ onRefresh }: RankingVendedoresProps) {
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    const carregarRanking = async () => {
      const dados = await buscarRanking()
      setRanking(dados)
      await onRefresh()
    }
    carregarRanking()
  }, [onRefresh])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de Vendedores</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {ranking.map((vendedor, index) => (
            <li key={vendedor.id} className="flex items-center justify-between">
              <span>
                {index + 1}. {vendedor.nome}
              </span>
              <span>USD {vendedor.valorTotalVendas.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

