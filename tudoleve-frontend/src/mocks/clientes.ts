export type ClienteStatus = 'ativo' | 'inativo' | 'bloqueado'

export interface ClienteEndereco {
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export interface ClientePedido {
  numero: string
  data: string
  status: string
  total: number
}

export interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  cpf: string
  status: ClienteStatus
  avatarCor: string
  dataCadastro: string
  ultimoAcesso: string
  totalPedidos: number
  totalGasto: number
  ticketMedio: number
  cidade: string
  estado: string
  endereco: ClienteEndereco
  pedidos: ClientePedido[]
  observacoes: string
  recorrente: boolean
}

export const statusConfig: Record<ClienteStatus, { label: string; variant: 'success' | 'outline' | 'danger' }> = {
  ativo: { label: 'Ativo', variant: 'success' },
  inativo: { label: 'Inativo', variant: 'outline' },
  bloqueado: { label: 'Bloqueado', variant: 'danger' },
}

const avatarCores = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600',
  'from-rose-400 to-rose-600',
  'from-teal-400 to-teal-600',
]

export const mockClientes: Cliente[] = [
  {
    id: 1,
    nome: 'Maria Souza',
    email: 'maria.souza@email.com',
    telefone: '(11) 98765-4321',
    cpf: '***. 456.789-**',
    status: 'ativo',
    avatarCor: avatarCores[0],
    dataCadastro: '10/01/2026',
    ultimoAcesso: '17/03/2026',
    totalPedidos: 7,
    totalGasto: 182430,
    ticketMedio: 26061,
    cidade: 'São Paulo',
    estado: 'SP',
    recorrente: true,
    endereco: { logradouro: 'Rua das Flores', numero: '142', complemento: 'Apto 32', bairro: 'Jardim Primavera', cidade: 'São Paulo', estado: 'SP', cep: '01234-567' },
    pedidos: [
      { numero: '#4521', data: '17/03/2026', status: 'aprovado', total: 22890 },
      { numero: '#4401', data: '10/02/2026', status: 'entregue', total: 31980 },
      { numero: '#4290', data: '05/01/2026', status: 'entregue', total: 15990 },
    ],
    observacoes: 'Cliente frequente. Prefere entrega expressa.',
  },
  {
    id: 2,
    nome: 'João Pereira',
    email: 'joao.pereira@email.com',
    telefone: '(21) 99123-4567',
    cpf: '***. 789.012-**',
    status: 'ativo',
    avatarCor: avatarCores[1],
    dataCadastro: '22/01/2026',
    ultimoAcesso: '17/03/2026',
    totalPedidos: 3,
    totalGasto: 62300,
    ticketMedio: 20767,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    recorrente: true,
    endereco: { logradouro: 'Av. Brasil', numero: '500', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20040-020' },
    pedidos: [
      { numero: '#4520', data: '17/03/2026', status: 'enviado', total: 8900 },
      { numero: '#4390', data: '14/02/2026', status: 'entregue', total: 28700 },
      { numero: '#4211', data: '22/01/2026', status: 'entregue', total: 24700 },
    ],
    observacoes: '',
  },
  {
    id: 3,
    nome: 'Ana Lima',
    email: 'ana.lima@email.com',
    telefone: '(31) 97654-3210',
    cpf: '***. 321.654-**',
    status: 'ativo',
    avatarCor: avatarCores[2],
    dataCadastro: '15/02/2026',
    ultimoAcesso: '17/03/2026',
    totalPedidos: 1,
    totalGasto: 42450,
    ticketMedio: 42450,
    cidade: 'Belo Horizonte',
    estado: 'MG',
    recorrente: false,
    endereco: { logradouro: 'Rua Maranhão', numero: '87', bairro: 'Santa Efigênia', cidade: 'Belo Horizonte', estado: 'MG', cep: '30150-330' },
    pedidos: [
      { numero: '#4519', data: '17/03/2026', status: 'pendente', total: 42450 },
    ],
    observacoes: 'Aguardando confirmação do boleto.',
  },
  {
    id: 4,
    nome: 'Carlos Silva',
    email: 'carlos.silva@email.com',
    telefone: '(85) 98877-6655',
    cpf: '***. 654.987-**',
    status: 'ativo',
    avatarCor: avatarCores[3],
    dataCadastro: '05/01/2026',
    ultimoAcesso: '16/03/2026',
    totalPedidos: 5,
    totalGasto: 98730,
    ticketMedio: 19746,
    cidade: 'Fortaleza',
    estado: 'CE',
    recorrente: true,
    endereco: { logradouro: 'Rua Padre Valdevino', numero: '1010', bairro: 'Aldeota', cidade: 'Fortaleza', estado: 'CE', cep: '60135-040' },
    pedidos: [
      { numero: '#4518', data: '16/03/2026', status: 'entregue', total: 15990 },
      { numero: '#4410', data: '20/02/2026', status: 'entregue', total: 22400 },
      { numero: '#4310', data: '28/01/2026', status: 'entregue', total: 31200 },
    ],
    observacoes: 'Cliente VIP. Sempre compra em grandes quantidades.',
  },
  {
    id: 5,
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@email.com',
    telefone: '(51) 93344-5566',
    cpf: '***. 111.222-**',
    status: 'inativo',
    avatarCor: avatarCores[4],
    dataCadastro: '12/01/2026',
    ultimoAcesso: '20/02/2026',
    totalPedidos: 2,
    totalGasto: 16700,
    ticketMedio: 8350,
    cidade: 'Porto Alegre',
    estado: 'RS',
    recorrente: false,
    endereco: { logradouro: 'Av. Ipiranga', numero: '6681', bairro: 'Partenon', cidade: 'Porto Alegre', estado: 'RS', cep: '90619-900' },
    pedidos: [
      { numero: '#4517', data: '16/03/2026', status: 'cancelado', total: 8300 },
      { numero: '#4202', data: '15/01/2026', status: 'entregue', total: 8400 },
    ],
    observacoes: 'Último pedido foi cancelado. Verificar motivo.',
  },
  {
    id: 6,
    nome: 'Roberto Alves',
    email: 'roberto.alves@email.com',
    telefone: '(47) 99988-7766',
    cpf: '***. 333.444-**',
    status: 'ativo',
    avatarCor: avatarCores[5],
    dataCadastro: '03/02/2026',
    ultimoAcesso: '16/03/2026',
    totalPedidos: 2,
    totalGasto: 56400,
    ticketMedio: 28200,
    cidade: 'Joinville',
    estado: 'SC',
    recorrente: true,
    endereco: { logradouro: 'Rua XV de Novembro', numero: '200', bairro: 'Centro', cidade: 'Joinville', estado: 'SC', cep: '89201-001' },
    pedidos: [
      { numero: '#4516', data: '16/03/2026', status: 'em_separacao', total: 28200 },
      { numero: '#4320', data: '05/02/2026', status: 'entregue', total: 28200 },
    ],
    observacoes: '',
  },
  {
    id: 7,
    nome: 'Patrícia Mendes',
    email: 'patricia.mendes@email.com',
    telefone: '(62) 98765-1234',
    cpf: '***. 555.666-**',
    status: 'ativo',
    avatarCor: avatarCores[6],
    dataCadastro: '08/02/2026',
    ultimoAcesso: '15/03/2026',
    totalPedidos: 1,
    totalGasto: 13480,
    ticketMedio: 13480,
    cidade: 'Goiânia',
    estado: 'GO',
    recorrente: false,
    endereco: { logradouro: 'Rua 68', numero: '311', bairro: 'Setor Sul', cidade: 'Goiânia', estado: 'GO', cep: '74083-060' },
    pedidos: [
      { numero: '#4515', data: '15/03/2026', status: 'aprovado', total: 13480 },
    ],
    observacoes: '',
  },
  {
    id: 8,
    nome: 'Lucas Fernandes',
    email: 'lucas.fernandes@email.com',
    telefone: '(91) 98001-2233',
    cpf: '***. 777.888-**',
    status: 'ativo',
    avatarCor: avatarCores[7],
    dataCadastro: '18/01/2026',
    ultimoAcesso: '15/03/2026',
    totalPedidos: 4,
    totalGasto: 87900,
    ticketMedio: 21975,
    cidade: 'Belém',
    estado: 'PA',
    recorrente: true,
    endereco: { logradouro: 'Tv. Padre Eutíquio', numero: '3560', bairro: 'Batista Campos', cidade: 'Belém', estado: 'PA', cep: '66033-000' },
    pedidos: [
      { numero: '#4514', data: '15/03/2026', status: 'enviado', total: 20000 },
      { numero: '#4405', data: '22/02/2026', status: 'entregue', total: 19800 },
      { numero: '#4290', data: '02/02/2026', status: 'entregue', total: 27600 },
      { numero: '#4180', data: '18/01/2026', status: 'entregue', total: 20500 },
    ],
    observacoes: 'Revendedor. Compra sempre em lote.',
  },
  {
    id: 9,
    nome: 'Juliana Rocha',
    email: 'juliana.rocha@email.com',
    telefone: '(71) 97766-5544',
    cpf: '***. 999.000-**',
    status: 'ativo',
    avatarCor: avatarCores[0],
    dataCadastro: '25/01/2026',
    ultimoAcesso: '14/03/2026',
    totalPedidos: 2,
    totalGasto: 14790,
    ticketMedio: 7395,
    cidade: 'Salvador',
    estado: 'BA',
    recorrente: true,
    endereco: { logradouro: 'Av. Sete de Setembro', numero: '890', bairro: 'Vitória', cidade: 'Salvador', estado: 'BA', cep: '40060-000' },
    pedidos: [
      { numero: '#4513', data: '14/03/2026', status: 'entregue', total: 6390 },
      { numero: '#4299', data: '28/01/2026', status: 'entregue', total: 8400 },
    ],
    observacoes: '',
  },
  {
    id: 10,
    nome: 'Eduardo Pinto',
    email: 'eduardo.pinto@email.com',
    telefone: '(11) 99876-5432',
    cpf: '***. 121.343-**',
    status: 'ativo',
    avatarCor: avatarCores[1],
    dataCadastro: '20/02/2026',
    ultimoAcesso: '14/03/2026',
    totalPedidos: 1,
    totalGasto: 29700,
    ticketMedio: 29700,
    cidade: 'São Paulo',
    estado: 'SP',
    recorrente: false,
    endereco: { logradouro: 'Rua Augusta', numero: '2200', bairro: 'Consolação', cidade: 'São Paulo', estado: 'SP', cep: '01412-100' },
    pedidos: [
      { numero: '#4512', data: '14/03/2026', status: 'pendente', total: 29700 },
    ],
    observacoes: 'Aguardando compensação do boleto.',
  },
  {
    id: 11,
    nome: 'Beatriz Lima',
    email: 'beatriz.lima@email.com',
    telefone: '(41) 93322-1100',
    cpf: '***. 565.676-**',
    status: 'bloqueado',
    avatarCor: avatarCores[2],
    dataCadastro: '14/01/2026',
    ultimoAcesso: '01/03/2026',
    totalPedidos: 3,
    totalGasto: 45600,
    ticketMedio: 15200,
    cidade: 'Curitiba',
    estado: 'PR',
    recorrente: true,
    endereco: { logradouro: 'Rua Mateus Leme', numero: '1400', bairro: 'São Lourenço', cidade: 'Curitiba', estado: 'PR', cep: '80040-110' },
    pedidos: [
      { numero: '#4420', data: '01/03/2026', status: 'cancelado', total: 15280 },
      { numero: '#4310', data: '10/02/2026', status: 'entregue', total: 16200 },
      { numero: '#4185', data: '14/01/2026', status: 'entregue', total: 14120 },
    ],
    observacoes: 'Conta bloqueada por chargebacks repetidos. Consultar jurídico antes de desbloquear.',
  },
  {
    id: 12,
    nome: 'Marcos Oliveira',
    email: 'marcos.oliveira@email.com',
    telefone: '(27) 98811-2233',
    cpf: '***. 787.898-**',
    status: 'ativo',
    avatarCor: avatarCores[3],
    dataCadastro: '01/03/2026',
    ultimoAcesso: '12/03/2026',
    totalPedidos: 1,
    totalGasto: 7500,
    ticketMedio: 7500,
    cidade: 'Vitória',
    estado: 'ES',
    recorrente: false,
    endereco: { logradouro: 'Av. Leitão da Silva', numero: '1700', bairro: 'Itararé', cidade: 'Vitória', estado: 'ES', cep: '29052-070' },
    pedidos: [
      { numero: '#4510', data: '12/03/2026', status: 'entregue', total: 7500 },
    ],
    observacoes: '',
  },
]

export const statusOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Bloqueado', value: 'bloqueado' },
]

export function formatCurrency(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function getIniciais(nome: string): string {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}
