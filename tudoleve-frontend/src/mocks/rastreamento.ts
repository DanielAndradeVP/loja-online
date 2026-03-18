export type StatusEntrega = 'pendente_envio' | 'em_transito' | 'atrasada' | 'entregue' | 'problema'

export type Transportadora =
  | 'correios'
  | 'jadlog'
  | 'total_express'
  | 'loggi'
  | 'transportadora_propria'

export interface EventoRastreio {
  status: string
  descricao: string
  data: string
  hora: string
  concluido: boolean
  atual: boolean
}

export interface Entrega {
  id: number
  pedido: string
  cliente: string
  transportadora: Transportadora
  codigoRastreio: string | null
  statusEntrega: StatusEntrega
  previsao: string
  cidadeOrigem: string
  cidadeDestino: string
  ufDestino: string
  diasAtraso?: number
  problemas?: string | null
  timeline: EventoRastreio[]
}

export const statusEntregaConfig: Record<StatusEntrega, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  pendente_envio: { label: 'Pendente de envio', variant: 'default' },
  em_transito: { label: 'Em trânsito', variant: 'outline' },
  atrasada: { label: 'Atrasada', variant: 'warning' },
  entregue: { label: 'Entregue', variant: 'success' },
  problema: { label: 'Com problema', variant: 'danger' },
}

export const transportadoraConfig: Record<Transportadora, { label: string }> = {
  correios: { label: 'Correios' },
  jadlog: { label: 'Jadlog' },
  total_express: { label: 'Total Express' },
  loggi: { label: 'Loggi' },
  transportadora_propria: { label: 'Frota própria' },
}

function makeTimeline(base: {
  enviado?: boolean
  emRota?: boolean
  entregue?: boolean
  atrasada?: boolean
  problema?: string | null
}, dataBase: string): EventoRastreio[] {
  const steps = [
    {
      status: 'Pedido aprovado',
      descricao: 'Pagamento confirmado e pedido liberado para separação',
    },
    {
      status: 'Em separação',
      descricao: 'Itens sendo separados no centro de distribuição',
    },
    {
      status: 'Postado',
      descricao: 'Enviado para a transportadora / agência',
    },
    {
      status: 'Em trânsito',
      descricao: 'Objeto em rota entre hubs logísticos',
    },
    {
      status: base.atrasada ? 'Atrasado' : 'Saiu para entrega',
      descricao: base.atrasada
        ? 'Entrega ultrapassou o prazo estimado'
        : 'Veículo saiu para entrega ao destinatário',
    },
    {
      status: base.entregue ? 'Entregue' : 'Pendente',
      descricao: base.entregue
        ? 'Entrega realizada ao destinatário'
        : 'Aguardando nova tentativa de entrega ou regularização',
    },
  ]

  const indiceAtual = base.entregue
    ? 5
    : base.emRota
      ? 4
      : base.enviado
        ? 3
        : 1

  return steps.map((step, i) => ({
    status: step.status,
    descricao: step.descricao,
    data: dataBase,
    hora: ['09:10', '10:45', '13:22', '18:05', '09:15', '11:40'][i] ?? '08:00',
    concluido: i < indiceAtual,
    atual: i === indiceAtual,
  }))
}

export const mockEntregas: Entrega[] = [
  {
    id: 1,
    pedido: '#4520',
    cliente: 'João Pereira',
    transportadora: 'correios',
    codigoRastreio: 'BR123456789BR',
    statusEntrega: 'em_transito',
    previsao: '20/03/2026',
    cidadeOrigem: 'São Paulo',
    cidadeDestino: 'Rio de Janeiro',
    ufDestino: 'RJ',
    timeline: makeTimeline({ enviado: true, emRota: true }, '17/03/2026'),
  },
  {
    id: 2,
    pedido: '#4518',
    cliente: 'Carlos Silva',
    transportadora: 'jadlog',
    codigoRastreio: 'BR987654321BR',
    statusEntrega: 'entregue',
    previsao: '16/03/2026',
    cidadeOrigem: 'São Paulo',
    cidadeDestino: 'Fortaleza',
    ufDestino: 'CE',
    timeline: makeTimeline({ enviado: true, emRota: true, entregue: true }, '16/03/2026'),
  },
  {
    id: 3,
    pedido: '#4514',
    cliente: 'Lucas Fernandes',
    transportadora: 'total_express',
    codigoRastreio: 'BR112233445BR',
    statusEntrega: 'atrasada',
    previsao: '16/03/2026',
    cidadeOrigem: 'São Paulo',
    cidadeDestino: 'Belém',
    ufDestino: 'PA',
    diasAtraso: 2,
    timeline: makeTimeline({ enviado: true, emRota: true, atrasada: true }, '15/03/2026'),
  },
  {
    id: 4,
    pedido: '#4513',
    cliente: 'Juliana Rocha',
    transportadora: 'loggi',
    codigoRastreio: 'BR556677889BR',
    statusEntrega: 'entregue',
    previsao: '15/03/2026',
    cidadeOrigem: 'São Paulo',
    cidadeDestino: 'Salvador',
    ufDestino: 'BA',
    timeline: makeTimeline({ enviado: true, emRota: true, entregue: true }, '14/03/2026'),
  },
  {
    id: 5,
    pedido: '#4516',
    cliente: 'Roberto Alves',
    transportadora: 'transportadora_propria',
    codigoRastreio: null,
    statusEntrega: 'pendente_envio',
    previsao: '19/03/2026',
    cidadeOrigem: 'Joinville',
    cidadeDestino: 'Joinville',
    ufDestino: 'SC',
    timeline: makeTimeline({ enviado: false }, '17/03/2026'),
  },
  {
    id: 6,
    pedido: '#4517',
    cliente: 'Fernanda Costa',
    transportadora: 'correios',
    codigoRastreio: null,
    statusEntrega: 'problema',
    previsao: '16/03/2026',
    cidadeOrigem: 'Porto Alegre',
    cidadeDestino: 'Porto Alegre',
    ufDestino: 'RS',
    diasAtraso: 3,
    problemas: 'Endereço incompleto / divergente',
    timeline: makeTimeline({ enviado: true, emRota: true, atrasada: true, problema: 'Endereço divergente' }, '16/03/2026'),
  },
]

export const statusEntregaOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Pendente de envio', value: 'pendente_envio' },
  { label: 'Em trânsito', value: 'em_transito' },
  { label: 'Atrasadas', value: 'atrasada' },
  { label: 'Entregues', value: 'entregue' },
  { label: 'Com problema', value: 'problema' },
]

export const transportadoraOptions = [
  { label: 'Todas as transportadoras', value: '' },
  { label: 'Correios', value: 'correios' },
  { label: 'Jadlog', value: 'jadlog' },
  { label: 'Total Express', value: 'total_express' },
  { label: 'Loggi', value: 'loggi' },
  { label: 'Frota própria', value: 'transportadora_propria' },
]

