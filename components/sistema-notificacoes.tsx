"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buscarNotificacoes, marcarNotificacaoComoLida } from "@/lib/api"

export function SistemaNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([])

  useEffect(() => {
    const carregarNotificacoes = async () => {
      const novasNotificacoes = await buscarNotificacoes()
      setNotificacoes(novasNotificacoes)
    }
    carregarNotificacoes()
    // Simular atualização em tempo real a cada 30 segundos
    const intervalo = setInterval(carregarNotificacoes, 30000)
    return () => clearInterval(intervalo)
  }, [])

  const handleMarcarComoLida = async (id: string) => {
    await marcarNotificacaoComoLida(id)
    setNotificacoes(notificacoes.filter((n) => n.id !== id))
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {naoLidas > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {naoLidas}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificacoes.length === 0 ? (
          <DropdownMenuItem>Nenhuma notificação</DropdownMenuItem>
        ) : (
          notificacoes.map((notificacao) => (
            <DropdownMenuItem key={notificacao.id} className="flex justify-between items-center">
              <span className={notificacao.lida ? "text-muted-foreground" : "font-medium"}>{notificacao.mensagem}</span>
              {!notificacao.lida && (
                <Button variant="ghost" size="sm" onClick={() => handleMarcarComoLida(notificacao.id)}>
                  Marcar como lida
                </Button>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

