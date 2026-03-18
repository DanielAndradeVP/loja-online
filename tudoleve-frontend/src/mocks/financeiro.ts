export type StatusTransacao = 'pendente' | 'liquidado' | 'em_analise' | 'estornado'

export type MeioPagamentoFinanceiro = 'pix' | 'cartao_credito' | 'boleto' | 'voucher'

export type TipoTransacao =
  | 'recebimento'
  | 'estorno'
  | 'taxa'
  | 'repasse'
  | 'ajuste'

export interface TransacaoFinanceira {
  id: number
  data: string
  hora: string
  pedido: string | null
  tipo: TipoTransacao
  meioPagamento: MeioPagamentoFinanceiro | null
  status: StatusTransacao
  descricao: string
  valorBruto: number
  taxas: number
  valorLiquido: number
}

export interface PontoGraficoFinanceiro {
  label: string
  entradas: number
  saidas: number
  liquido: number
}

export interface ResumoRepasses {
  proximoCiclo: string
  valorPrevisto: number
  valorEmAnalise: number
  valorBloqueado: number
}

export interface ResumoChargebacks {
  totalChargebacks: number
  emAnalise: number
  estornados: number
  valorTotal: number
}

export interface FluxoCaixaResumo {
  saldoAtual: number
  entradas7dias: number
  saidas7dias: number
  saldoPrevisto7dias: number
}

export const statusTransacaoConfig: Record<StatusTransacao, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  pendente: { label: 'Pendente', variant: 'warning' },
  liquidado: { label: 'Liquidado', variant: 'success' },
  em_analise: { label: 'Em análise', variant: 'default' },
  estornado: { label: 'Estornado', variant: 'danger' },
}

export const meioPagamentoConfigFinanceiro: Record<MeioPagamentoFinanceiro, string> = {
  pix: 'PIX',
  cartao_credito: 'Cartão de crédito',
  boleto: 'Boleto bancário',
  voucher: 'Voucher / crédito loja',
}

export const mockResumoKpisFinanceiro = {
  faturamentoBrutoHoje: 487250,
  faturamentoLiquidoHoje: 438900,
  recebimentosPendentes: 128900,
  totalReembolsos: 18900,
}

export const mockGraficoEntradasPeriodo: PontoGraficoFinanceiro[] = [
  { label: 'Seg', entradas: 720000, saidas: 210000, liquido: 510000 },
  { label: 'Ter', entradas: 845000, saidas: 265000, liquido: 580000 },
  { label: 'Qua', entradas: 632000, saidas: 198000, liquido: 434000 },
  { label: 'Qui', entradas: 918000, saidas: 305000, liquido: 613000 },
  { label: 'Sex', entradas: 1089000, saidas: 327000, liquido: 762000 },
  { label: 'Sáb', entradas: 756000, saidas: 242000, liquido: 514000 },
  { label: 'Dom', entradas: 498000, saidas: 164000, liquido: 334000 },
]

export const mockTransacoesFinanceiras: TransacaoFinanceira[] = [
  {
    id: 1,
    data: '17/03/2026',
    hora: '14:32',
    pedido: '#4521',
    tipo: 'recebimento',
    meioPagamento: 'cartao_credito',
    status: 'liquidado',
    descricao: 'Venda pedido #4521 – Cartão crédito 1x',
    valorBruto: 24990,
    taxas: 2990,
    valorLiquido: 22000,
  },
  {
    id: 2,
    data: '17/03/2026',
    hora: '11:10',
    pedido: '#4520',
    tipo: 'recebimento',
    meioPagamento: 'pix',
    status: 'liquidado',
    descricao: 'Venda pedido #4520 – PIX instantâneo',
    valorBruto: 8900,
    taxas: 200,
    valorLiquido: 8700,
  },
  {
    id: 3,
    data: '17/03/2026',
    hora: '09:05',
    pedido: '#4519',
    tipo: 'recebimento',
    meioPagamento: 'boleto',
    status: 'pendente',
    descricao: 'Venda pedido #4519 – Boleto aguardando compensação',
    valorBruto: 42450,
    taxas: 0,
    valorLiquido: 42450,
  },
  {
    id: 4,
    data: '16/03/2026',
    hora: '10:45',
    pedido: '#4518',
    tipo: 'recebimento',
    meioPagamento: 'cartao_credito',
    status: 'liquidado',
    descricao: 'Venda pedido #4518 – Cartão crédito 2x',
    valorBruto: 15990,
    taxas: 1890,
    valorLiquido: 14100,
  },
  {
    id: 5,
    data: '16/03/2026',
    hora: '08:30',
    pedido: '#4517',
    tipo: 'estorno',
    meioPagamento: 'pix',
    status: 'estornado',
    descricao: 'Reembolso integral pedido #4517 – Cancelamento',
    valorBruto: -8300,
    taxas: 0,
    valorLiquido: -8300,
  },
  {
    id: 6,
    data: '16/03/2026',
    hora: '18:00',
    pedido: null,
    tipo: 'taxa',
    meioPagamento: 'cartao_credito',
    status: 'liquidado',
    descricao: 'Tarifas de processamento cartão – ciclo diário',
    valorBruto: -32800,
    taxas: 0,
    valorLiquido: -32800,
  },
  {
    id: 7,
    data: '15/03/2026',
    hora: '17:10',
    pedido: null,
    tipo: 'repasse',
    meioPagamento: null,
    status: 'liquidado',
    descricao: 'Repasse consolidado semana 10/2026',
    valorBruto: -482000,
    taxas: 0,
    valorLiquido: -482000,
  },
  {
    id: 8,
    data: '15/03/2026',
    hora: '09:00',
    pedido: '#4513',
    tipo: 'recebimento',
    meioPagamento: 'cartao_credito',
    status: 'liquidado',
    descricao: 'Venda pedido #4513 – Cartão crédito 1x',
    valorBruto: 6390,
    taxas: 890,
    valorLiquido: 5500,
  },
  {
    id: 9,
    data: '14/03/2026',
    hora: '16:20',
    pedido: '#4512',
    tipo: 'recebimento',
    meioPagamento: 'boleto',
    status: 'em_analise',
    descricao: 'Venda pedido #4512 – Boleto em análise de risco',
    valorBruto: 29700,
    taxas: 0,
    valorLiquido: 29700,
  },
  {
    id: 10,
    data: '14/03/2026',
    hora: '12:05',
    pedido: null,
    tipo: 'ajuste',
    meioPagamento: null,
    status: 'liquidado',
    descricao: 'Ajuste de saldo – conciliação diferença centavos',
    valorBruto: -250,
    taxas: 0,
    valorLiquido: -250,
  },
]

export const mockResumoRepasses: ResumoRepasses = {
  proximoCiclo: '20/03/2026',
  valorPrevisto: 842000,
  valorEmAnalise: 98000,
  valorBloqueado: 32000,
}

export const mockResumoChargebacks: ResumoChargebacks = {
  totalChargebacks: 7,
  emAnalise: 3,
  estornados: 4,
  valorTotal: 18900,
}

export const mockFluxoCaixaResumo: FluxoCaixaResumo = {
  saldoAtual: 1289000,
  entradas7dias: 5295000,
  saidas7dias: 1738000,
  saldoPrevisto7dias: 4846000,
}

export const statusTransacaoOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Liquidado', value: 'liquidado' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em análise', value: 'em_analise' },
  { label: 'Estornado', value: 'estornado' },
]

export const meioPagamentoOptionsFinanceiro = [
  { label: 'Todos os meios', value: '' },
  { label: 'PIX', value: 'pix' },
  { label: 'Cartão de crédito', value: 'cartao_credito' },
  { label: 'Boleto', value: 'boleto' },
  { label: 'Voucher / crédito loja', value: 'voucher' },
]

export function formatCurrency(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

