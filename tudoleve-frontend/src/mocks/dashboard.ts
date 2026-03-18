export type PedidoStatusSimples =
  | 'pendente'
  | 'aprovado'
  | 'em_separacao'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export interface KpiCard {
  id: string
  label: string
  value: string
  trendLabel: string
  trendVariant: 'up' | 'down' | 'neutral'
  icon: string
  iconBg: string
  iconColor: string
}

export interface ChartPoint {
  label: string
  value: number
}

export interface PedidoRecenteDash {
  numero: string
  cliente: string
  status: PedidoStatusSimples
  total: string
  data: string
  pagamento: string
}

export interface TopProduto {
  nome: string
  vendas: number
  receita: string
  estoque: number
}

export interface Alerta {
  tipo: 'warning' | 'danger' | 'info'
  titulo: string
  mensagem: string
  acao: string
  link: string
}

export interface Atalho {
  label: string
  link: string
  icon: string
  color: string
}

export const mockKpiCards: KpiCard[] = [
  {
    id: 'faturamento',
    label: 'Faturamento do dia',
    value: 'R$ 4.872,50',
    trendLabel: '↑ +12% vs ontem',
    trendVariant: 'up',
    icon: '💰',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'pedidos',
    label: 'Pedidos hoje',
    value: '38',
    trendLabel: '↑ +5 vs ontem',
    trendVariant: 'up',
    icon: '📦',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'ticket',
    label: 'Ticket médio',
    value: 'R$ 128,22',
    trendLabel: '↓ -3% vs ontem',
    trendVariant: 'down',
    icon: '🎯',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    id: 'clientes',
    label: 'Clientes novos',
    value: '12',
    trendLabel: '↑ +2 vs ontem',
    trendVariant: 'up',
    icon: '👤',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'estoque',
    label: 'Estoque baixo',
    value: '7 produtos',
    trendLabel: 'Atenção necessária',
    trendVariant: 'neutral',
    icon: '⚠️',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
]

export const mockVendasSemana: ChartPoint[] = [
  { label: 'Seg', value: 3200 },
  { label: 'Ter', value: 4100 },
  { label: 'Qua', value: 2900 },
  { label: 'Qui', value: 5200 },
  { label: 'Sex', value: 4872 },
  { label: 'Sáb', value: 6100 },
  { label: 'Dom', value: 3800 },
]

export const mockPedidosPorDia: ChartPoint[] = [
  { label: 'Seg', value: 22 },
  { label: 'Ter', value: 31 },
  { label: 'Qua', value: 18 },
  { label: 'Qui', value: 41 },
  { label: 'Sex', value: 38 },
  { label: 'Sáb', value: 47 },
  { label: 'Dom', value: 29 },
]

export const mockPedidosRecentesDash: PedidoRecenteDash[] = [
  { numero: '#4521', cliente: 'Maria Souza', status: 'aprovado', total: 'R$ 249,90', data: '17/03/2026', pagamento: 'Cartão' },
  { numero: '#4520', cliente: 'João Pereira', status: 'enviado', total: 'R$ 89,00', data: '17/03/2026', pagamento: 'PIX' },
  { numero: '#4519', cliente: 'Ana Lima', status: 'pendente', total: 'R$ 399,50', data: '17/03/2026', pagamento: 'Boleto' },
  { numero: '#4518', cliente: 'Carlos Silva', status: 'entregue', total: 'R$ 159,90', data: '16/03/2026', pagamento: 'Cartão' },
  { numero: '#4517', cliente: 'Fernanda Costa', status: 'cancelado', total: 'R$ 74,00', data: '16/03/2026', pagamento: 'PIX' },
  { numero: '#4516', cliente: 'Roberto Alves', status: 'em_separacao', total: 'R$ 312,00', data: '16/03/2026', pagamento: 'Cartão' },
]

export const mockTopProdutos: TopProduto[] = [
  { nome: 'Caixa Organizadora 40L', vendas: 128, receita: 'R$ 12.800,00', estoque: 45 },
  { nome: 'Saco de Viagem Compressível', vendas: 97, receita: 'R$ 7.275,00', estoque: 12 },
  { nome: 'Kit Cabides Slim (20un)', vendas: 84, receita: 'R$ 5.880,00', estoque: 0 },
  { nome: 'Organizador de Gaveta Modular', vendas: 71, receita: 'R$ 4.260,00', estoque: 31 },
  { nome: 'Porta-Documentos A4', vendas: 63, receita: 'R$ 3.150,00', estoque: 8 },
]

export const mockAlertas: Alerta[] = [
  {
    tipo: 'warning',
    titulo: 'Pagamentos pendentes',
    mensagem: '14 pedidos aguardam confirmação de pagamento',
    acao: 'Ver pedidos',
    link: '/admin/pedidos',
  },
  {
    tipo: 'danger',
    titulo: 'Estoque crítico',
    mensagem: '7 produtos estão com estoque abaixo do mínimo',
    acao: 'Ver estoque',
    link: '/admin/estoque',
  },
  {
    tipo: 'warning',
    titulo: 'Pagamentos com falha',
    mensagem: '3 pagamentos falharam e precisam de revisão',
    acao: 'Ver financeiro',
    link: '/admin/financeiro',
  },
]

export const mockAtalhos: Atalho[] = [
  { label: 'Novo produto', link: '/admin/produtos/create', icon: '➕', color: 'bg-slate-900 text-white' },
  { label: 'Pedidos', link: '/admin/pedidos', icon: '📦', color: 'bg-blue-600 text-white' },
  { label: 'Estoque', link: '/admin/estoque', icon: '🏭', color: 'bg-amber-500 text-white' },
  { label: 'Relatórios', link: '/admin/relatorios', icon: '📊', color: 'bg-violet-600 text-white' },
  { label: 'Clientes', link: '/admin/clientes', icon: '👥', color: 'bg-emerald-600 text-white' },
  { label: 'Marketing', link: '/admin/marketing', icon: '🎯', color: 'bg-pink-600 text-white' },
]

export const mockStatusOperacao = [
  { label: 'Pedidos aprovados hoje', cor: 'bg-emerald-500', valor: 24 },
  { label: 'Aguardando pagamento', cor: 'bg-amber-500', valor: 14 },
  { label: 'Em separação', cor: 'bg-blue-500', valor: 7 },
  { label: 'Enviados', cor: 'bg-slate-400', valor: 31 },
  { label: 'Cancelamentos hoje', cor: 'bg-red-500', valor: 3 },
  { label: 'Taxa de conversão', cor: 'bg-violet-500', valor: null, texto: '3,2%' },
]
