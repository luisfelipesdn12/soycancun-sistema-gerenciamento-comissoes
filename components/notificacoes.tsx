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

// Simulating a notification system
const notificacoes = [
  { id: 1, mensagem: "Nova venda registrada!", lida: false },
  { id: 2, mensagem: "Meta mensal atingida!", lida: false },
  { id: 3, mensagem: "Comissão paga", lida: true },
]

export function Notificacoes() {
  const [naoLidas, setNaoLidas] = useState(0)

  useEffect(() => {
    setNaoLidas(notificacoes.filter((n) => !n.lida).length)
  }, [])

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
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificacoes.map((notificacao) => (
          <DropdownMenuItem key={notificacao.id}>
            {notificacao.mensagem}
            {!notificacao.lida && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

