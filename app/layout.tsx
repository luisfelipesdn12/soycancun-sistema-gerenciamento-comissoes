import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BarraLateral } from "@/components/barra-lateral"
import { Toaster } from "@/components/ui/toaster"
import { executarVerificacaoDiaria } from "@/lib/api"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { QuickNav } from "@/components/quick-nav"

const inter = Inter({ subsets: ["latin"] })

// Remove these lines
// export const metadata: Metadata = {
//   title: "Soy Cancun - Sistema de Gerenciamento",
//   description: "Sistema de gerenciamento de passeios e comissões",
// }

export async function generateMetadata(): Promise<Metadata> {
  await executarVerificacaoDiaria()
  return {
    title: "Soy Cancun - Sistema de Gerenciamento",
    description: "Sistema de gerenciamento de passeios e comissões",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${inter.className} h-full bg-gradient-to-br from-background to-background-100 dark:from-background dark:to-background-900`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex h-full">
            <BarraLateral />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                  <QuickNav />
                  <ModeToggle />
                </div>
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'
