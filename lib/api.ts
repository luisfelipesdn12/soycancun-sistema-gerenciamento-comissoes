// Esta é uma camada de API simulada. Em uma aplicação real, essas funções fariam chamadas reais à API.

import { addDays, subDays, format } from "date-fns"

const passeios = []
const vendedores = []
const vendas = []
const provedores = [
  { id: "aquaworld", nome: "Aquaworld", contato: "" },
  { id: "dolphins", nome: "Dolphins Discovery", contato: "" },
  { id: "xcaret", nome: "Xcaret", contato: "" },
  { id: "alltournative", nome: "Alltournative", contato: "" },
  { id: "culturalzone", nome: "Cultural Zone", contato: "" },
]

export const adicionarPasseio = async (passeio) => {
  passeio.id = Date.now().toString()
  passeio.custo = Number(passeio.custo) || 0
  passeio.precoVenda = Number(passeio.precoVenda) || passeio.custo * 1.3
  passeio.provedor = passeio.provedor || "Não especificado"
  passeios.push(passeio)
  return passeio
}

export const adicionarVendedor = async (vendedor) => {
  vendedor.id = Date.now().toString()
  vendedor.comissaoTotal = 0
  vendedor.totalVendas = 0
  vendedor.percentualComissao = vendedor.comissao // Armazena o percentual de comissão
  vendedores.push(vendedor)
  return vendedor
}

export const adicionarVenda = async (venda) => {
  venda.id = Date.now().toString()
  venda.itens = venda.itens.map((item) => {
    const passeio = passeios.find((p) => p.id === item.passeioId)
    return {
      ...item,
      dataPasseio: item.dataPasseio || venda.data,
      valorUnitario: Number(item.valorUnitario),
      valorTotal: Number(item.valorTotal),
      quantidade: Number(item.quantidade),
      provedor: passeio ? passeio.provedor : null,
      custo: passeio ? passeio.custo * item.quantidade : 0,
      hotel: item.hotel || "Não especificado",
      balance: Number(item.balance) || 0,
      metodoPagamento: item.metodoPagamento || "balance",
    }
  })
  vendas.push(venda)

  // Atualizar estatísticas do vendedor
  const vendedor = vendedores.find((v) => v.id === venda.vendedorId)
  if (vendedor) {
    vendedor.totalVendas += 1
    const valorTotalVenda = venda.itens.reduce((total, item) => total + item.valorTotal, 0)
    const custoTotalVenda = venda.itens.reduce((total, item) => total + item.custo, 0)
    const lucroVenda = valorTotalVenda - custoTotalVenda
    const comissao = lucroVenda * (vendedor.percentualComissao / 100)
    vendedor.comissaoTotal += comissao
  }

  // Atualizar saldo do provedor
  venda.itens.forEach((item) => {
    if (item.provedor && item.balance > 0) {
      const provedor = provedores.find((p) => p.id === item.provedor)
      if (provedor) {
        provedor.saldo = (provedor.saldo || 0) + item.balance
      }
    }
  })

  return venda
}

export const buscarPasseios = async () => {
  return passeios.map(({ id, nome, custo, precoVenda, provedor }) => ({ id, nome, custo, precoVenda, provedor }))
}

export const buscarVendedores = async () => {
  return vendedores
}

export const buscarVendedor = async (id) => {
  return vendedores.find((v) => v.id === id)
}

export const buscarPasseiosMaisVendidos = async () => {
  // Isso normalmente envolveria a agregação de dados de vendas
  return passeios
    .map((passeio) => ({
      nome: passeio.nome,
      vendas: Math.floor(Math.random() * 100),
    }))
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 5)
}

export const buscarPasseiosMaisVendidosPorVendedor = async (vendedorId) => {
  // Simulação de dados
  return passeios
    .map((passeio) => ({
      nome: passeio.nome,
      vendas: Math.floor(Math.random() * 50),
    }))
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, 5)
}

export const buscarVendasPorVendedor = async (vendedorId: string) => {
  const vendasVendedor = vendas.filter((v) => v.vendedorId === vendedorId)
  return vendasVendedor
    .flatMap((venda) =>
      venda.itens.map((item) => ({
        id: `${venda.id}-${item.passeioId}`,
        data: venda.data,
        nomeCliente: venda.nomeCliente,
        passeio: passeios.find((p) => p.id === item.passeioId)?.nome || "Passeio Desconhecido",
        quantidade: item.quantidade,
        valorTotal: item.valorTotal,
      })),
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

export const buscarTodasVendas = async () => {
  return vendas
    .flatMap((venda) =>
      venda.itens.map((item) => ({
        id: `${venda.id}-${item.passeioId}`,
        data: venda.data,
        nomeCliente: venda.nomeCliente,
        vendedor: vendedores.find((v) => v.id === venda.vendedorId)?.nome || "Vendedor Desconhecido",
        passeio: passeios.find((p) => p.id === item.passeioId)?.nome || "Passeio Desconhecido",
        quantidade: item.quantidade,
        valorTotal: item.valorTotal,
      })),
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

export const buscarVendasPorCliente = async (nomeCliente) => {
  return vendas
    .filter((venda) => venda.nomeCliente === nomeCliente)
    .map((venda) => ({
      data: venda.data,
      vendedor: vendedores.find((v) => v.id === venda.vendedorId)?.nome || "Vendedor Desconhecido",
      itens: venda.itens.map((item) => {
        const passeio = passeios.find((p) => p.id === item.passeioId)
        return {
          passeio: passeio?.nome || "Passeio Desconhecido",
          quantidade: item.quantidade,
          valorVendido: Number(item.valorVendido),
          dataPasseio: item.dataPasseio,
          provedor: passeio?.provedor || "Não especificado",
        }
      }),
      valorTotal: calcularValorTotal(venda),
    }))
}

export const buscarReceitaMensal = async () => {
  // Isso normalmente envolveria a agregação de dados de vendas
  return Array.from({ length: 12 }, (_, i) => ({
    mes: new Date(0, i).toLocaleString("pt-BR", { month: "short" }),
    receita: Math.floor(Math.random() * 10000),
  }))
}

export const buscarVendasMensais = async () => {
  // Isso normalmente envolveria a agregação de dados de vendas
  return Array.from({ length: 12 }, (_, i) => ({
    mes: new Date(0, i).toLocaleString("pt-BR", { month: "short" }),
    vendas: Math.floor(Math.random() * 100),
    comissoes: Math.floor(Math.random() * 1000),
  }))
}

export const gerarRelatorio = async (tipo, mes, ano) => {
  // Isso normalmente envolveria a agregação de dados e geração de um arquivo de relatório
  return {
    tipo,
    mes,
    ano,
    dados: "Os dados do relatório iriam aqui",
  }
}

function calcularComissao(venda, percentualComissao) {
  const valorTotal = calcularValorTotal(venda)
  const custoTotal = calcularCustoTotal(venda)
  const lucro = valorTotal - custoTotal
  const comissao = lucro * (percentualComissao / 100)
  return comissao
}

function calcularCustoTotal(venda) {
  return venda.itens.reduce((total, item) => {
    return total + (item.custo || 0)
  }, 0)
}

function calcularValorTotal(venda) {
  return venda.itens.reduce((total, item) => {
    const valorItem = Number(item.valorTotal) || Number(item.valorVendido) * Number(item.quantidade)
    return total + (isNaN(valorItem) ? 0 : valorItem)
  }, 0)
}

export const gerarRelatorioVendedor = async (vendedorId, dataInicio, dataFim) => {
  // Simulação de geração de relatório
  // Em uma implementação real, você filtraria as vendas por data e vendedor
  const vendasFiltradas = vendas.filter(
    (venda) =>
      venda.vendedorId === vendedorId &&
      new Date(venda.data) >= new Date(dataInicio) &&
      new Date(venda.data) <= new Date(dataFim),
  )

  const totalVendas = vendasFiltradas.length
  const valorTotal = vendasFiltradas.reduce((total, venda) => total + calcularValorTotal(venda), 0)
  const custoTotal = vendasFiltradas.reduce((total, venda) => total + calcularCustoTotal(venda), 0)
  const lucroTotal = valorTotal - custoTotal
  const comissaoTotal = lucroTotal * 0.5

  return {
    vendedor: vendedores.find((v) => v.id === vendedorId).nome,
    periodo: {
      inicio: dataInicio,
      fim: dataFim,
    },
    totalVendas,
    valorTotal,
    custoTotal,
    lucroTotal,
    comissaoTotal,
    vendas: vendasFiltradas.map((venda) => ({
      id: venda.id,
      data: venda.data,
      cliente: venda.nomeCliente,
      itens: venda.itens.map((item) => {
        const passeio = passeios.find((p) => p.id === item.passeioId)
        return {
          passeio: passeio.nome,
          quantidade: item.quantidade,
          valorUnitario: Number.parseFloat(item.valorVendido) / item.quantidade,
          valorTotal: Number.parseFloat(item.valorVendido),
        }
      }),
      valorTotal: calcularValorTotal(venda),
      custoTotal: calcularCustoTotal(venda),
      lucro: calcularValorTotal(venda) - calcularCustoTotal(venda),
      comissao: (calcularValorTotal(venda) - calcularCustoTotal(venda)) * 0.5,
    })),
  }
}

export const deletarVendedor = async (id: string) => {
  const index = vendedores.findIndex((v) => v.id === id)
  if (index !== -1) {
    vendedores.splice(index, 1)
    return true
  }
  return false
}

export const buscarEstatisticasVendedor = async (vendedorId: string) => {
  const vendedor = vendedores.find((v) => v.id === vendedorId)
  if (!vendedor) return null

  const vendasVendedor = vendas.filter((v) => v.vendedorId === vendedorId)
  const totalVendas = vendasVendedor.length
  const valorTotalVendas = vendasVendedor.reduce((total, venda) => total + calcularValorTotal(venda), 0)

  return {
    nome: vendedor.nome,
    totalVendas,
    valorTotalVendas,
    comissaoTotal: vendedor.comissaoTotal,
    metaMensal: 10000, // Exemplo de meta mensal em USD
    progressoMeta: (valorTotalVendas / 10000) * 100,
  }
}

export const buscarTendenciasVendas = async (periodo: "diario" | "semanal" | "mensal") => {
  const hoje = new Date()
  let dados

  switch (periodo) {
    case "diario":
      dados = Array.from({ length: 7 }, (_, i) => {
        const data = subDays(hoje, i)
        const vendasDia = vendas.filter((v) => new Date(v.data).toDateString() === data.toDateString())
        return {
          data: format(data, "dd/MM"),
          vendas: vendasDia.length,
          valor: vendasDia.reduce((total, venda) => total + calcularValorTotal(venda), 0),
        }
      }).reverse()
      break
    case "semanal":
      dados = Array.from({ length: 4 }, (_, i) => {
        const dataInicio = subDays(hoje, i * 7 + 6)
        const dataFim = subDays(hoje, i * 7)
        const vendasSemana = vendas.filter((v) => {
          const dataVenda = new Date(v.data)
          return dataVenda >= dataInicio && dataVenda <= dataFim
        })
        return {
          data: `${format(dataInicio, "dd/MM")} - ${format(dataFim, "dd/MM")}`,
          vendas: vendasSemana.length,
          valor: vendasSemana.reduce((total, venda) => total + calcularValorTotal(venda), 0),
        }
      }).reverse()
      break
    case "mensal":
      dados = Array.from({ length: 6 }, (_, i) => {
        const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
        const dataFim = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 0)
        const vendasMes = vendas.filter((v) => {
          const dataVenda = new Date(v.data)
          return dataVenda >= dataInicio && dataVenda <= dataFim
        })
        return {
          data: format(dataInicio, "MM/yyyy"),
          vendas: vendasMes.length,
          valor: vendasMes.reduce((total, venda) => total + calcularValorTotal(venda), 0),
        }
      }).reverse()
      break
  }

  return dados
}

export const buscarRanking = async () => {
  return vendedores
    .map((vendedor) => {
      const vendasVendedor = vendas.filter((v) => v.vendedorId === vendedor.id)
      const valorTotalVendas = vendasVendedor.reduce((total, venda) => total + calcularValorTotal(venda), 0)
      return {
        id: vendedor.id,
        nome: vendedor.nome,
        valorTotalVendas,
        totalVendas: vendasVendedor.length,
      }
    })
    .sort((a, b) => b.valorTotalVendas - a.valorTotalVendas)
}

export const buscarPasseiosAgendados = async (dataInicio: string, dataFim: string) => {
  // Simulating API call
  return vendas
    .filter((venda) => {
      const dataVenda = new Date(venda.data)
      return dataVenda >= new Date(dataInicio) && dataVenda <= new Date(dataFim)
    })
    .flatMap((venda) =>
      venda.itens.map((item) => ({
        id: `${venda.id}-${item.passeioId}`,
        data: item.dataPasseio || venda.data,
        passeio: passeios.find((p) => p.id === item.passeioId)?.nome || "Passeio Desconhecido",
        cliente: venda.nomeCliente,
        vendedor: vendedores.find((v) => v.id === venda.vendedorId)?.nome || "Vendedor Desconhecido",
        hotel: item.hotel || "Não informado",
        pax: item.quantidade,
      })),
    )
}

export const registrarFeedbackCliente = async (vendaId: string, avaliacao: number, comentario: string) => {
  const venda = vendas.find((v) => v.id === vendaId)
  if (venda) {
    venda.feedback = { avaliacao, comentario }
    return true
  }
  return false
}

export const buscarFeedbacksRecentes = async () => {
  return vendas
    .filter((venda) => venda.feedback)
    .map((venda) => ({
      id: venda.id,
      cliente: venda.nomeCliente,
      avaliacao: venda.feedback.avaliacao,
      comentario: venda.feedback.comentario,
      data: venda.data,
    }))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5)
}

export const editarPasseio = async (passeio) => {
  const index = passeios.findIndex((p) => p.id === passeio.id)
  if (index !== -1) {
    passeios[index] = {
      ...passeios[index],
      ...passeio,
      custo: Number(passeio.custo) || 0,
      precoVenda: Number(passeio.precoVenda) || 0,
      provedor: passeio.provedor || "Não especificado",
    }
    return passeios[index]
  }
  throw new Error("Passeio não encontrado")
}

export const deletarPasseio = async (id) => {
  const index = passeios.findIndex((p) => p.id === id)
  if (index !== -1) {
    passeios.splice(index, 1)
    return true
  }
  throw new Error("Passeio não encontrado")
}

export const buscarLucroMensal = async (ano: string) => {
  // Simulação de dados de lucro mensal
  return Array.from({ length: 12 }, (_, i) => ({
    mes: new Date(Number(ano), i).toLocaleString("pt-BR", { month: "short" }),
    lucro: Math.floor(Math.random() * 50000) + 10000, // Lucro entre 10000 e 60000
  }))
}

export const buscarMetaGeral = async () => {
  // Simulação de meta geral da empresa
  return 1000000 // Exemplo: meta de 1 milhão de dólares
}

export const buscarProgressoMetaGeral = async () => {
  // Simulação de progresso da meta geral
  return Math.random() * 100 // Retorna um valor entre 0 e 100
}

export const buscarPasseiosMaisVendidosMensal = async () => {
  // Simulação de dados dos passeios mais vendidos no mês
  return passeios
    .map((passeio) => ({
      nome: passeio.nome,
      vendas: Math.floor(Math.random() * 100), // Número aleatório de vendas entre 0 e 99
    }))
    .sort((a, b) => b.vendas - a.vendas) // Ordena por número de vendas, do maior para o menor
    .slice(0, 5) // Pega os 5 primeiros (mais vendidos)
}

export const adicionarProvedor = async (provedor: { nome: string; contato: string }) => {
  // In a real application, this would make an API call to add the provider
  // For now, we'll just simulate adding it to our list of providers
  const novoProvedor = {
    id: Date.now().toString(),
    ...provedor,
  }
  provedores.push(novoProvedor)
  return novoProvedor
}

export const buscarPasseiosPorProvedor = async (provedor: string, dataInicio: Date, dataFim: Date) => {
  // Filter vendas by date range and provider
  const vendasFiltradas = vendas.filter((venda) => {
    const dataVenda = new Date(venda.data)
    return (
      dataVenda >= dataInicio &&
      dataVenda <= dataFim &&
      venda.itens.some((item) => {
        const passeio = passeios.find((p) => p.id === item.passeioId)
        return passeio?.provedor === provedor
      })
    )
  })

  // Map to the format needed
  return vendasFiltradas.flatMap((venda) =>
    venda.itens
      .filter((item) => {
        const passeio = passeios.find((p) => p.id === item.passeioId)
        return passeio?.provedor === provedor
      })
      .map((item) => {
        const passeio = passeios.find((p) => p.id === item.passeioId)
        return {
          id: `${venda.id}-${item.passeioId}`,
          data: item.dataPasseio || venda.data,
          nome: passeio?.nome,
          quantidade: item.quantidade,
          valorPagar: passeio ? passeio.custo * item.quantidade : 0,
          status: Math.random() > 0.5 ? "pago" : "pendente", // Simulating payment status
          metodoPagamento: ["efetivo", "transferencia", "cartao"][Math.floor(Math.random() * 3)], // Simulating payment method
        }
      }),
  )
}

export const buscarPagamentosPendentes = async (provedor: string, dataInicio: Date, dataFim: Date) => {
  const passeiosProvedor = await buscarPasseiosPorProvedor(provedor, dataInicio, dataFim)

  const totalPago = passeiosProvedor.filter((p) => p.status === "pago").reduce((sum, p) => sum + p.valorPagar, 0)
  const pendente = passeiosProvedor.filter((p) => p.status === "pendente").reduce((sum, p) => sum + p.valorPagar, 0)

  return {
    totalPago,
    pendente,
    total: totalPago + pendente,
  }
}

export const buscarProvedores = async () => {
  return provedores
}

export const editarProvedor = async (id: string, novoNome: string) => {
  const index = provedores.findIndex((p) => p.id === id)
  if (index !== -1) {
    provedores[index].nome = novoNome
    return provedores[index]
  }
  throw new Error("Provedor não encontrado")
}

export const deletarProvedor = async (id: string) => {
  const index = provedores.findIndex((p) => p.id === id)
  if (index !== -1) {
    provedores.splice(index, 1)
    return true
  }
  throw new Error("Provedor não encontrado")
}

let notificacoes = [
  { id: "1", mensagem: "Nova venda registrada!", lida: false },
  { id: "2", mensagem: "Meta mensal atingida!", lida: false },
  { id: "3", mensagem: "Lembrete: Passeio agendado para amanhã", lida: false },
]

export const buscarNotificacoes = async () => {
  // Simulating API call
  return notificacoes
}

export const marcarNotificacaoComoLida = async (id: string) => {
  // Simulating API call
  notificacoes = notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n))
  return true
}

export const criarNotificacao = async (mensagem: string) => {
  // Simulating API call
  const novaNotificacao = {
    id: Date.now().toString(),
    mensagem,
    lida: false,
  }
  notificacoes.push(novaNotificacao)
  return novaNotificacao
}

// Function to create reminders for upcoming tours and pending payments
export const criarLembretes = async () => {
  const hoje = new Date()
  const amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000)

  // Check for tours scheduled for tomorrow
  const passeiosAmanha = await buscarPasseiosAgendados(amanha.toISOString(), amanha.toISOString())
  for (const passeio of passeiosAmanha) {
    await criarNotificacao(`Lembrete: Passeio "${passeio.passeio}" agendado para amanhã`)
  }

  // Check for pending payments
  const pagamentosPendentes = vendas.filter((venda) => venda.status === "pendente")
  for (const venda of pagamentosPendentes) {
    await criarNotificacao(`Pagamento pendente para a venda #${venda.id}`)
  }
}

// This function should be called periodically (e.g., daily) to create reminders
export const executarVerificacaoDiaria = async () => {
  await criarLembretes()
  // You can add more daily checks here
}

// Add these new types and functions at the end of the file

type PaymentTransaction = {
  id: string
  date: string
  amount: number
  type: "income" | "expense"
  description: string
  clientName?: string
  vendorName?: string
  sellerName?: string
}

const paymentTransactions: PaymentTransaction[] = []

export const adicionarTransacao = async (transaction: Omit<PaymentTransaction, "id">) => {
  const newTransaction = { ...transaction, id: Date.now().toString() }
  paymentTransactions.push(newTransaction)
  return newTransaction
}

export const buscarTransacoes = async (startDate: string, endDate: string) => {
  return paymentTransactions.filter((transaction) => transaction.date >= startDate && transaction.date <= endDate)
}

export const calcularBalanco = async (startDate: string, endDate: string) => {
  const transactions = await buscarTransacoes(startDate, endDate)
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expenses
  return { income, expenses, balance }
}

export const editarVendedor = async (vendedor) => {
  const index = vendedores.findIndex((v) => v.id === vendedor.id)
  if (index !== -1) {
    vendedores[index] = {
      ...vendedores[index],
      nome: vendedor.nome,
      percentualComissao: Number(vendedor.comissao),
    }
    return vendedores[index]
  }
  throw new Error("Vendedor não encontrado")
}

