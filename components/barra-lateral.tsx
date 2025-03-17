"use client"
import Link from "next/link"
import { Home, Map, Users, ShoppingCart, FileText, User, Building, DollarSign, List } from "lucide-react"
import { useEffect, useState } from "react"
import { buscarVendedores } from "@/lib/api"
import Image from "next/image"

const itensNavegacao = [
  { nome: "Painel", href: "/", icone: Home },
  { nome: "Passeios", href: "/passeios", icone: Map },
  { nome: "Provedores", href: "/provedores", icone: Building },
  { nome: "Vendedores", href: "/vendedores", icone: Users },
  { nome: "Vendas", href: "/vendas", icone: ShoppingCart },
  { nome: "Passeios Vendidos", href: "/vendas/passeios-vendidos", icone: List },
  { nome: "Relatórios", href: "/relatorios", icone: FileText },
  { nome: "Gestão de Pagamentos", href: "/gestao-pagamentos", icone: DollarSign },
]

export function BarraLateral() {
  const [vendedores, setVendedores] = useState([])

  useEffect(() => {
    const carregarVendedores = async () => {
      const dados = await buscarVendedores()
      setVendedores(dados)
    }
    carregarVendedores()
  }, [])

  return (
    <div className="w-64 md:w-72 lg:w-80 bg-card text-card-foreground border-r border-border shadow-lg transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex justify-center mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-soy-cancun-1-150x58-jlAS0rTsgB1S9ockK1apC4GM9cKfH0.png"
            alt="Soy Cancun"
            width={150}
            height={58}
            className="h-auto"
          />
        </div>
        <nav>
          <ul className="space-y-1 px-2 md:px-4">
            {itensNavegacao.map((item) => (
              <li key={item.nome}>
                <Link
                  href={item.href}
                  className="flex items-center px-2 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icone className="mr-3 h-5 w-5" />
                  {item.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 md:mt-8">
          <h2 className="px-2 md:px-4 text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Painéis de Vendedores
          </h2>
          <ul className="space-y-1 px-2 md:px-4">
            {vendedores.map((vendedor) => (
              <li key={vendedor.id}>
                <Link
                  href={`/vendedor/${vendedor.id}`}
                  className="flex items-center px-2 md:px-4 py-2 text-xs md:text-sm text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  {vendedor.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

