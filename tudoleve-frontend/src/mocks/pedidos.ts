export type PedidoStatus =
  | 'pendente'
  | 'aprovado'
  | 'em_separacao'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export type FormaPagamento = 'pix' | 'cartao_credito' | 'boleto'

export interface PedidoItem {
  produto: string
  sku: string
  quantidade: number
  precoUnitario: number
  total: number
}

export interface TimelineEvent {
  status: string
  descricao: string
  data: string
  hora: string
  concluido: boolean
  atual: boolean
}

export interface Pedido {
  id: number
  numero: string
  cliente: string
  email: string
  telefone: string
  status: PedidoStatus
  formaPagamento: FormaPagamento
  subtotal: number
  frete: number
  desconto: number
  total: number
  data: string
  hora: string
  items: PedidoItem[]
  timeline: TimelineEvent[]
  endereco: string
  codigoRastreio: string | null
  observacao: string | null
}

export const statusConfig: Record<PedidoStatus, {
  label: string
  variant: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}> = {
  pendente: { label: 'Pendente', variant: 'warning' },
  aprovado: { label: 'Aprovado', variant: 'success' },
  em_separacao: { label: 'Em separação', variant: 'default' },
  enviado: { label: 'Enviado', variant: 'outline' },
  entregue: { label: 'Entregue', variant: 'success' },
  cancelado: { label: 'Cancelado', variant: 'danger' },
}

export const pagamentoConfig: Record<FormaPagamento, string> = {
  pix: 'PIX',
  cartao_credito: 'Cartão de crédito',
  boleto: 'Boleto bancário',
}

function makeTimeline(status: PedidoStatus, data: string): TimelineEvent[] {
  const steps: Array<{ key: PedidoStatus; label: string; desc: string }> = [
    { key: 'pendente', label: 'Pedido realizado', desc: 'Pedido recebido e aguardando confirmação' },
    { key: 'aprovado', label: 'Pagamento aprovado', desc: 'Pagamento confirmado com sucesso' },
    { key: 'em_separacao', label: 'Em separação', desc: 'Itens sendo separados no estoque' },
    { key: 'enviado', label: 'Enviado', desc: 'Pedido postado e a caminho' },
    { key: 'entregue', label: 'Entregue', desc: 'Pedido entregue ao destinatário' },
  ]

  const cancelado = status === 'cancelado'
  const statusIndex = cancelado
    ? 1
    : steps.findIndex(s => s.key === status)

  const hours = ['09:12', '10:05', '14:30', '16:00', '11:22']

  const timeline: TimelineEvent[] = steps.map((step, i) => ({
    status: step.label,
    descricao: step.desc,
    data,
    hora: hours[i] ?? '08:00',
    concluido: i < statusIndex || (i === statusIndex && !cancelado),
    atual: i === statusIndex && !cancelado,
  }))

  if (cancelado) {
    timeline.push({
      status: 'Cancelado',
      descricao: 'Pedido cancelado pelo cliente ou loja',
      data,
      hora: '15:44',
      concluido: true,
      atual: true,
    })
  }

  return timeline
}

export const mockPedidos: Pedido[] = [
  {
    id: 1,
    numero: '#4521',
    cliente: 'Maria Souza',
    email: 'maria.souza@email.com',
    telefone: '(11) 98765-4321',
    status: 'aprovado',
    formaPagamento: 'cartao_credito',
    subtotal: 22990,
    frete: 1900,
    desconto: 2000,
    total: 22890,
    data: '17/03/2026',
    hora: '14:32',
    endereco: 'Rua das Flores, 142 – Jardim Primavera, São Paulo/SP – 01234-567',
    codigoRastreio: null,
    observacao: null,
    items: [
      { produto: 'Caixa Organizadora 40L', sku: 'ORG-40L-CZ', quantidade: 2, precoUnitario: 9990, total: 19980 },
      { produto: 'Organizador de Gaveta Modular', sku: 'GAV-MOD-BR', quantidade: 1, precoUnitario: 3010, total: 3010 },
    ],
    timeline: makeTimeline('aprovado', '17/03/2026'),
  },
  {
    id: 2,
    numero: '#4520',
    cliente: 'João Pereira',
    email: 'joao.pereira@email.com',
    telefone: '(21) 99123-4567',
    status: 'enviado',
    formaPagamento: 'pix',
    subtotal: 8900,
    frete: 0,
    desconto: 0,
    total: 8900,
    data: '17/03/2026',
    hora: '11:10',
    endereco: 'Av. Brasil, 500 – Centro, Rio de Janeiro/RJ – 20040-020',
    codigoRastreio: 'BR123456789BR',
    observacao: 'Entregar no portão lateral',
    items: [
      { produto: 'Saco de Viagem Compressível', sku: 'SAC-VIA-AZ', quantidade: 1, precoUnitario: 7500, total: 7500 },
      { produto: 'Etiquetas Adesivas (100un)', sku: 'ETQ-100-BR', quantidade: 2, precoUnitario: 700, total: 1400 },
    ],
    timeline: makeTimeline('enviado', '17/03/2026'),
  },
  {
    id: 3,
    numero: '#4519',
    cliente: 'Ana Lima',
    email: 'ana.lima@email.com',
    telefone: '(31) 97654-3210',
    status: 'pendente',
    formaPagamento: 'boleto',
    subtotal: 39950,
    frete: 2500,
    desconto: 0,
    total: 42450,
    data: '17/03/2026',
    hora: '09:05',
    endereco: 'Rua Maranhão, 87 – Santa Efigênia, Belo Horizonte/MG – 30150-330',
    codigoRastreio: null,
    observacao: null,
    items: [
      { produto: 'Kit Cabides Slim (20un)', sku: 'CAB-SLM-20', quantidade: 3, precoUnitario: 6990, total: 20970 },
      { produto: 'Caixa Organizadora 40L', sku: 'ORG-40L-CZ', quantidade: 2, precoUnitario: 9490, total: 18980 },
    ],
    timeline: makeTimeline('pendente', '17/03/2026'),
  },
  {
    id: 4,
    numero: '#4518',
    cliente: 'Carlos Silva',
    email: 'carlos.silva@email.com',
    telefone: '(85) 98877-6655',
    status: 'entregue',
    formaPagamento: 'cartao_credito',
    subtotal: 15990,
    frete: 1200,
    desconto: 1200,
    total: 15990,
    data: '16/03/2026',
    hora: '10:45',
    endereco: 'Rua Padre Valdevino, 1010 – Aldeota, Fortaleza/CE – 60135-040',
    codigoRastreio: 'BR987654321BR',
    observacao: null,
    items: [
      { produto: 'Saco de Viagem Compressível', sku: 'SAC-VIA-AZ', quantidade: 2, precoUnitario: 7500, total: 15000 },
      { produto: 'Porta-Etiquetas', sku: 'PET-CLR-01', quantidade: 2, precoUnitario: 495, total: 990 },
    ],
    timeline: makeTimeline('entregue', '16/03/2026'),
  },
  {
    id: 5,
    numero: '#4517',
    cliente: 'Fernanda Costa',
    email: 'fernanda.costa@email.com',
    telefone: '(51) 93344-5566',
    status: 'cancelado',
    formaPagamento: 'pix',
    subtotal: 7400,
    frete: 900,
    desconto: 0,
    total: 8300,
    data: '16/03/2026',
    hora: '08:30',
    endereco: 'Av. Ipiranga, 6681 – Partenon, Porto Alegre/RS – 90619-900',
    codigoRastreio: null,
    observacao: 'Cliente solicitou cancelamento por engano no endereço',
    items: [
      { produto: 'Porta-Documentos A4', sku: 'DOC-A4-PR', quantidade: 2, precoUnitario: 3700, total: 7400 },
    ],
    timeline: makeTimeline('cancelado', '16/03/2026'),
  },
  {
    id: 6,
    numero: '#4516',
    cliente: 'Roberto Alves',
    email: 'roberto.alves@email.com',
    telefone: '(47) 99988-7766',
    status: 'em_separacao',
    formaPagamento: 'cartao_credito',
    subtotal: 31200,
    frete: 0,
    desconto: 3000,
    total: 28200,
    data: '16/03/2026',
    hora: '15:20',
    endereco: 'Rua XV de Novembro, 200 – Centro, Joinville/SC – 89201-001',
    codigoRastreio: null,
    observacao: null,
    items: [
      { produto: 'Kit Cabides Slim (20un)', sku: 'CAB-SLM-20', quantidade: 2, precoUnitario: 6990, total: 13980 },
      { produto: 'Caixa Organizadora 40L', sku: 'ORG-40L-CZ', quantidade: 1, precoUnitario: 9490, total: 9490 },
      { produto: 'Organizador de Gaveta Modular', sku: 'GAV-MOD-BR', quantidade: 2, precoUnitario: 3865, total: 7730 },
    ],
    timeline: makeTimeline('em_separacao', '16/03/2026'),
  },
  {
    id: 7,
    numero: '#4515',
    cliente: 'Patrícia Mendes',
    email: 'patricia.mendes@email.com',
    telefone: '(62) 98765-1234',
    status: 'aprovado',
    formaPagamento: 'pix',
    subtotal: 11980,
    frete: 1500,
    desconto: 0,
    total: 13480,
    data: '15/03/2026',
    hora: '16:00',
    endereco: 'Rua 68, 311 – Setor Sul, Goiânia/GO – 74083-060',
    codigoRastreio: null,
    observacao: null,
    items: [
      { produto: 'Saco de Viagem Compressível', sku: 'SAC-VIA-AZ', quantidade: 1, precoUnitario: 7500, total: 7500 },
      { produto: 'Kit Cabides Slim (20un)', sku: 'CAB-SLM-20', quantidade: 1, precoUnitario: 4480, total: 4480 },
    ],
    timeline: makeTimeline('aprovado', '15/03/2026'),
  },
  {
    id: 8,
    numero: '#4514',
    cliente: 'Lucas Fernandes',
    email: 'lucas.fernandes@email.com',
    telefone: '(91) 98001-2233',
    status: 'enviado',
    formaPagamento: 'boleto',
    subtotal: 19800,
    frete: 2200,
    desconto: 2000,
    total: 20000,
    data: '15/03/2026',
    hora: '10:15',
    endereco: 'Tv. Padre Eutíquio, 3560 – Batista Campos, Belém/PA – 66033-000',
    codigoRastreio: 'BR112233445BR',
    observacao: null,
    items: [
      { produto: 'Caixa Organizadora 40L', sku: 'ORG-40L-CZ', quantidade: 2, precoUnitario: 9900, total: 19800 },
    ],
    timeline: makeTimeline('enviado', '15/03/2026'),
  },
  {
    id: 9,
    numero: '#4513',
    cliente: 'Juliana Rocha',
    email: 'juliana.rocha@email.com',
    telefone: '(71) 97766-5544',
    status: 'entregue',
    formaPagamento: 'cartao_credito',
    subtotal: 5490,
    frete: 900,
    desconto: 0,
    total: 6390,
    data: '14/03/2026',
    hora: '09:00',
    endereco: 'Av. Sete de Setembro, 890 – Vitória, Salvador/BA – 40060-000',
    codigoRastreio: 'BR556677889BR',
    observacao: null,
    items: [
      { produto: 'Porta-Documentos A4', sku: 'DOC-A4-PR', quantidade: 1, precoUnitario: 3700, total: 3700 },
      { produto: 'Organizador de Gaveta Modular', sku: 'GAV-MOD-BR', quantidade: 1, precoUnitario: 1790, total: 1790 },
    ],
    timeline: makeTimeline('entregue', '14/03/2026'),
  },
  {
    id: 10,
    numero: '#4512',
    cliente: 'Eduardo Pinto',
    email: 'eduardo.pinto@email.com',
    telefone: '(11) 99876-5432',
    status: 'pendente',
    formaPagamento: 'boleto',
    subtotal: 29700,
    frete: 0,
    desconto: 0,
    total: 29700,
    data: '14/03/2026',
    hora: '17:50',
    endereco: 'Rua Augusta, 2200 – Consolação, São Paulo/SP – 01412-100',
    codigoRastreio: null,
    observacao: 'Aguardando compensação do boleto',
    items: [
      { produto: 'Kit Cabides Slim (20un)', sku: 'CAB-SLM-20', quantidade: 3, precoUnitario: 6990, total: 20970 },
      { produto: 'Saco de Viagem Compressível', sku: 'SAC-VIA-AZ', quantidade: 1, precoUnitario: 8730, total: 8730 },
    ],
    timeline: makeTimeline('pendente', '14/03/2026'),
  },
  {
    id: 11,
    numero: '#4511',
    cliente: 'Beatriz Souza',
    email: 'beatriz.souza@email.com',
    telefone: '(41) 93322-1100',
    status: 'em_separacao',
    formaPagamento: 'pix',
    subtotal: 14980,
    frete: 1300,
    desconto: 1000,
    total: 15280,
    data: '13/03/2026',
    hora: '13:20',
    endereco: 'Rua Mateus Leme, 1400 – São Lourenço, Curitiba/PR – 80040-110',
    codigoRastreio: null,
    observacao: null,
    items: [
      { produto: 'Caixa Organizadora 40L', sku: 'ORG-40L-CZ', quantidade: 1, precoUnitario: 9990, total: 9990 },
      { produto: 'Organizador de Gaveta Modular', sku: 'GAV-MOD-BR', quantidade: 2, precoUnitario: 2495, total: 4990 },
    ],
    timeline: makeTimeline('em_separacao', '13/03/2026'),
  },
  {
    id: 12,
    numero: '#4510',
    cliente: 'Marcos Oliveira',
    email: 'marcos.oliveira@email.com',
    telefone: '(27) 98811-2233',
    status: 'entregue',
    formaPagamento: 'cartao_credito',
    subtotal: 7500,
    frete: 0,
    desconto: 0,
    total: 7500,
    data: '12/03/2026',
    hora: '11:30',
    endereco: 'Av. Leitão da Silva, 1700 – Itararé, Vitória/ES – 29052-070',
    codigoRastreio: 'BR998877665BR',
    observacao: null,
    items: [
      { produto: 'Saco de Viagem Compressível', sku: 'SAC-VIA-AZ', quantidade: 1, precoUnitario: 7500, total: 7500 },
    ],
    timeline: makeTimeline('entregue', '12/03/2026'),
  },
]

export const statusOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Em separação', value: 'em_separacao' },
  { label: 'Enviado', value: 'enviado' },
  { label: 'Entregue', value: 'entregue' },
  { label: 'Cancelado', value: 'cancelado' },
]

export const pagamentoOptions = [
  { label: 'Todas as formas', value: '' },
  { label: 'PIX', value: 'pix' },
  { label: 'Cartão de crédito', value: 'cartao_credito' },
  { label: 'Boleto bancário', value: 'boleto' },
]
