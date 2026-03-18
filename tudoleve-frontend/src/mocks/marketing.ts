export type CampanhaStatus = 'ativa' | 'pausada' | 'encerrada' | 'rascunho' | 'agendada'
export type CampanhaCanal = 'email' | 'instagram' | 'google' | 'push' | 'sms' | 'whatsapp'
export type CupomTipo = 'percentual' | 'fixo' | 'frete_gratis'
export type CupomStatus = 'ativo' | 'expirado' | 'pausado'
export type AutomacaoStatus = 'ativa' | 'pausada' | 'rascunho'

export interface Campanha {
  id: number
  nome: string
  canal: CampanhaCanal
  status: CampanhaStatus
  dataInicio: string
  dataFim: string
  orcamento: number
  gasto: number
  alcance: number
  cliques: number
  conversoes: number
  receita: number
  descricao: string
}

export interface Cupom {
  id: number
  codigo: string
  descricao: string
  tipo: CupomTipo
  valor: number
  minPedido: number
  usos: number
  limiteUsos: number
  status: CupomStatus
  dataExpiracao: string
  publico: string
}

export interface Banner {
  id: number
  nome: string
  posicao: string
  status: 'ativo' | 'inativo'
  imagemEmoji: string
  imagemCor: string
  link: string
  dataInicio: string
  dataFim: string
  cliques: number
}

export interface Automacao {
  id: number
  nome: string
  tipo: 'email' | 'remarketing' | 'push' | 'carrinho' | 'sms'
  status: AutomacaoStatus
  gatilho: string
  enviados: number
  abertos: number
  convertidos: number
  ultimaExecucao: string
  proximaExecucao: string
}

export interface EventoCalendario {
  id: number
  titulo: string
  data: number
  tipo: CampanhaCanal | 'lancamento' | 'promocao' | 'feriado'
  cor: string
  descricao: string
}

export const canalConfig: Record<CampanhaCanal, { label: string; cor: string; bg: string; icone: string }> = {
  email:     { label: 'E-mail',     cor: 'text-blue-700',   bg: 'bg-blue-50',   icone: '📧' },
  instagram: { label: 'Instagram',  cor: 'text-pink-700',   bg: 'bg-pink-50',   icone: '📸' },
  google:    { label: 'Google Ads', cor: 'text-amber-700',  bg: 'bg-amber-50',  icone: '🔍' },
  push:      { label: 'Push',       cor: 'text-violet-700', bg: 'bg-violet-50', icone: '🔔' },
  sms:       { label: 'SMS',        cor: 'text-emerald-700',bg: 'bg-emerald-50',icone: '💬' },
  whatsapp:  { label: 'WhatsApp',   cor: 'text-green-700',  bg: 'bg-green-50',  icone: '🟢' },
}

export const campanhaStatusConfig: Record<CampanhaStatus, { label: string; variant: 'success' | 'warning' | 'outline' | 'default' | 'danger' }> = {
  ativa:     { label: 'Ativa',     variant: 'success' },
  pausada:   { label: 'Pausada',   variant: 'warning' },
  encerrada: { label: 'Encerrada', variant: 'outline' },
  rascunho:  { label: 'Rascunho', variant: 'default' },
  agendada:  { label: 'Agendada', variant: 'default' },
}

export const mockCampanhas: Campanha[] = [
  {
    id: 1,
    nome: 'Semana do Consumidor',
    canal: 'email',
    status: 'ativa',
    dataInicio: '13/03/2026',
    dataFim: '20/03/2026',
    orcamento: 150000,
    gasto: 87000,
    alcance: 18400,
    cliques: 1920,
    conversoes: 148,
    receita: 1847200,
    descricao: 'Campanha de e-mail para a semana do consumidor com descontos de até 40%.',
  },
  {
    id: 2,
    nome: 'Organização em Foco',
    canal: 'instagram',
    status: 'ativa',
    dataInicio: '10/03/2026',
    dataFim: '31/03/2026',
    orcamento: 200000,
    gasto: 134000,
    alcance: 52800,
    cliques: 3240,
    conversoes: 201,
    receita: 2412000,
    descricao: 'Stories e reels patrocinados mostrando produtos de organização em uso.',
  },
  {
    id: 3,
    nome: 'Google Shopping – Março',
    canal: 'google',
    status: 'ativa',
    dataInicio: '01/03/2026',
    dataFim: '31/03/2026',
    orcamento: 300000,
    gasto: 218000,
    alcance: 94200,
    cliques: 6810,
    conversoes: 389,
    receita: 5124000,
    descricao: 'Campanha de Google Shopping para produtos de organização e viagem.',
  },
  {
    id: 4,
    nome: 'Push – Carrinho Abandonado',
    canal: 'push',
    status: 'pausada',
    dataInicio: '01/02/2026',
    dataFim: '31/03/2026',
    orcamento: 50000,
    gasto: 18000,
    alcance: 3200,
    cliques: 710,
    conversoes: 43,
    receita: 492000,
    descricao: 'Notificações push para usuários que abandonaram o carrinho nas últimas 2h.',
  },
  {
    id: 5,
    nome: 'Lançamento Caixa 20L',
    canal: 'email',
    status: 'agendada',
    dataInicio: '22/03/2026',
    dataFim: '28/03/2026',
    orcamento: 80000,
    gasto: 0,
    alcance: 0,
    cliques: 0,
    conversoes: 0,
    receita: 0,
    descricao: 'E-mail marketing para lançamento da Caixa Organizadora 20L.',
  },
  {
    id: 6,
    nome: 'Cashback Fevereiro',
    canal: 'sms',
    status: 'encerrada',
    dataInicio: '01/02/2026',
    dataFim: '28/02/2026',
    orcamento: 100000,
    gasto: 98000,
    alcance: 8500,
    cliques: 1230,
    conversoes: 97,
    receita: 1089000,
    descricao: 'SMS com oferta de cashback de 10% para clientes que não compraram em 30 dias.',
  },
]

export const mockCupons: Cupom[] = [
  { id: 1,  codigo: 'BEMVINDO20', descricao: 'Desconto de boas-vindas', tipo: 'percentual',  valor: 20,  minPedido: 5000,   usos: 142, limiteUsos: 500, status: 'ativo',    dataExpiracao: '31/05/2026', publico: 'Novos clientes' },
  { id: 2,  codigo: 'FRETEGRATIS', descricao: 'Frete grátis acima de R$150', tipo: 'frete_gratis', valor: 0, minPedido: 15000, usos: 88,  limiteUsos: 200, status: 'ativo',    dataExpiracao: '30/04/2026', publico: 'Todos os clientes' },
  { id: 3,  codigo: 'VOLTA30',    descricao: 'Campanha de reativação', tipo: 'percentual',  valor: 30,  minPedido: 10000,  usos: 34,  limiteUsos: 100, status: 'ativo',    dataExpiracao: '20/03/2026', publico: 'Clientes inativos +60 dias' },
  { id: 4,  codigo: 'VIP50',      descricao: 'Cupom VIP exclusivo', tipo: 'fixo',          valor: 5000, minPedido: 20000, usos: 12,  limiteUsos: 50,  status: 'ativo',    dataExpiracao: '31/03/2026', publico: 'Clientes VIP' },
  { id: 5,  codigo: 'CARNAVAL15', descricao: 'Promo Carnaval', tipo: 'percentual',         valor: 15,  minPedido: 0,      usos: 310, limiteUsos: 300, status: 'expirado', dataExpiracao: '04/03/2026', publico: 'Todos os clientes' },
  { id: 6,  codigo: 'ORGANIZA10', descricao: 'Semana da organização', tipo: 'percentual',  valor: 10,  minPedido: 8000,   usos: 56,  limiteUsos: 500, status: 'ativo',    dataExpiracao: '22/03/2026', publico: 'Todos os clientes' },
  { id: 7,  codigo: 'ANIVER25',   descricao: 'Aniversário da loja', tipo: 'percentual',    valor: 25,  minPedido: 5000,   usos: 0,   limiteUsos: 1000,status: 'pausado',  dataExpiracao: '15/04/2026', publico: 'Todos os clientes' },
  { id: 8,  codigo: 'FRETE0PLUS', descricao: 'Frete grátis + bônus', tipo: 'frete_gratis', valor: 0,  minPedido: 25000,  usos: 21,  limiteUsos: 150, status: 'ativo',    dataExpiracao: '31/03/2026', publico: 'Clientes recorrentes' },
]

export const mockBanners: Banner[] = [
  { id: 1, nome: 'Banner Hero – Semana do Consumidor', posicao: 'Home – Principal', status: 'ativo',  imagemEmoji: '🎉', imagemCor: 'from-blue-500 to-violet-600',  link: '/promocoes/consumidor', dataInicio: '13/03/2026', dataFim: '20/03/2026', cliques: 2480 },
  { id: 2, nome: 'Banner Secundário – Viagem', posicao: 'Home – Secundário', status: 'ativo',  imagemEmoji: '✈️', imagemCor: 'from-cyan-400 to-blue-500',   link: '/categoria/viagem', dataInicio: '01/03/2026', dataFim: '31/03/2026', cliques: 1190 },
  { id: 3, nome: 'Banner Categoria Organização', posicao: 'Categoria – Topo', status: 'ativo',  imagemEmoji: '📦', imagemCor: 'from-slate-500 to-slate-700',  link: '/categoria/organizacao', dataInicio: '01/03/2026', dataFim: '31/03/2026', cliques: 870 },
  { id: 4, nome: 'Banner Checkout – Frete Grátis', posicao: 'Checkout – Lateral', status: 'ativo',  imagemEmoji: '🚚', imagemCor: 'from-emerald-400 to-teal-600', link: '/frete-gratis', dataInicio: '10/03/2026', dataFim: '20/03/2026', cliques: 640 },
  { id: 5, nome: 'Banner Lançamento Caixa 20L', posicao: 'Home – Rodapé', status: 'inativo', imagemEmoji: '🆕', imagemCor: 'from-amber-400 to-orange-500',  link: '/produto/caixa-organizadora-20l', dataInicio: '22/03/2026', dataFim: '28/03/2026', cliques: 0 },
]

export const mockAutomacoes: Automacao[] = [
  {
    id: 1,
    nome: 'Boas-vindas – Série de 3 e-mails',
    tipo: 'email',
    status: 'ativa',
    gatilho: 'Novo cadastro',
    enviados: 1240,
    abertos: 816,
    convertidos: 108,
    ultimaExecucao: '17/03/2026 às 08:00',
    proximaExecucao: '18/03/2026 às 08:00',
  },
  {
    id: 2,
    nome: 'Carrinho abandonado – Recuperação',
    tipo: 'carrinho',
    status: 'ativa',
    gatilho: 'Carrinho abandonado por +2h',
    enviados: 892,
    abertos: 534,
    convertidos: 67,
    ultimaExecucao: '17/03/2026 às 16:30',
    proximaExecucao: 'Em tempo real',
  },
  {
    id: 3,
    nome: 'Reativação – Clientes inativos',
    tipo: 'remarketing',
    status: 'ativa',
    gatilho: 'Sem compra há 60 dias',
    enviados: 440,
    abertos: 220,
    convertidos: 28,
    ultimaExecucao: '10/03/2026 às 09:00',
    proximaExecucao: '24/03/2026 às 09:00',
  },
  {
    id: 4,
    nome: 'Push – Flash Sale (fins de semana)',
    tipo: 'push',
    status: 'pausada',
    gatilho: 'Sábado às 10h (automático)',
    enviados: 3200,
    abertos: 1480,
    convertidos: 89,
    ultimaExecucao: '07/03/2026 às 10:00',
    proximaExecucao: 'Pausada',
  },
  {
    id: 5,
    nome: 'Pós-compra – NPS + upsell',
    tipo: 'email',
    status: 'ativa',
    gatilho: '7 dias após entrega',
    enviados: 680,
    abertos: 392,
    convertidos: 44,
    ultimaExecucao: '16/03/2026 às 10:00',
    proximaExecucao: '17/03/2026 às 10:00',
  },
  {
    id: 6,
    nome: 'SMS – Confirmação de envio',
    tipo: 'sms',
    status: 'rascunho',
    gatilho: 'Pedido enviado (status = enviado)',
    enviados: 0,
    abertos: 0,
    convertidos: 0,
    ultimaExecucao: '–',
    proximaExecucao: '–',
  },
]

export const mockEventosCalendario: EventoCalendario[] = [
  { id: 1,  titulo: 'Semana do Consumidor',     data: 13, tipo: 'email',     cor: 'bg-blue-500',    descricao: 'Início da campanha de e-mail' },
  { id: 2,  titulo: 'Semana do Consumidor',     data: 14, tipo: 'instagram', cor: 'bg-pink-500',    descricao: 'Stories patrocinados ativos' },
  { id: 3,  titulo: 'Semana do Consumidor',     data: 15, tipo: 'google',    cor: 'bg-amber-500',   descricao: 'Boost Google Shopping' },
  { id: 4,  titulo: 'Dia do Consumidor',        data: 15, tipo: 'promocao',  cor: 'bg-emerald-500', descricao: 'Data comemorativa' },
  { id: 5,  titulo: 'Fim Semana Consumidor',    data: 20, tipo: 'email',     cor: 'bg-blue-500',    descricao: 'Último dia da campanha' },
  { id: 6,  titulo: 'Lançamento Caixa 20L',     data: 22, tipo: 'lancamento',cor: 'bg-slate-700',   descricao: 'E-mail de lançamento do novo produto' },
  { id: 7,  titulo: 'Lançamento Caixa 20L',     data: 23, tipo: 'instagram', cor: 'bg-pink-500',    descricao: 'Post e stories de lançamento' },
  { id: 8,  titulo: 'Cupom VOLTA30 expira',     data: 20, tipo: 'promocao',  cor: 'bg-amber-500',   descricao: 'Último dia do cupom de reativação' },
  { id: 9,  titulo: 'Flash Sale',               data: 28, tipo: 'push',      cor: 'bg-violet-500',  descricao: 'Push para sábado de flash sale' },
  { id: 10, titulo: 'Flash Sale',               data: 29, tipo: 'push',      cor: 'bg-violet-500',  descricao: 'Push domingo' },
  { id: 11, titulo: 'Automação boas-vindas',    data: 18, tipo: 'email',     cor: 'bg-blue-400',    descricao: 'Sequência automática de e-mails' },
  { id: 12, titulo: 'Dia da Páscoa',            data: 29, tipo: 'feriado',   cor: 'bg-rose-400',    descricao: 'Feriado nacional' },
]

export const mockKpisMarketing = {
  campanhasAtivas: 3,
  cuponsAtivos: 6,
  taxaConversao: '3.8%',
  carrinhoRecuperados: 67,
  receitaTotal: 'R$ 108.490,00',
  roiMedio: '4.2x',
}

export const automacaoConfig: Record<string, { label: string; icone: string; cor: string }> = {
  email:      { label: 'E-mail',      icone: '📧', cor: 'bg-blue-50 text-blue-700' },
  remarketing:{ label: 'Remarketing', icone: '🎯', cor: 'bg-violet-50 text-violet-700' },
  push:       { label: 'Push',        icone: '🔔', cor: 'bg-amber-50 text-amber-700' },
  carrinho:   { label: 'Carrinho',    icone: '🛒', cor: 'bg-emerald-50 text-emerald-700' },
  sms:        { label: 'SMS',         icone: '💬', cor: 'bg-pink-50 text-pink-700' },
}

export const automacaoStatusConfig: Record<AutomacaoStatus, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  ativa:    { label: 'Ativa',    variant: 'success' },
  pausada:  { label: 'Pausada',  variant: 'warning' },
  rascunho: { label: 'Rascunho', variant: 'default' },
}

export function formatCurrency(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function calcROI(receita: number, gasto: number): string {
  if (!gasto) return '–'
  return `${(receita / gasto).toFixed(1)}x`
}

export function calcCTR(cliques: number, alcance: number): string {
  if (!alcance) return '–'
  return `${((cliques / alcance) * 100).toFixed(1)}%`
}
