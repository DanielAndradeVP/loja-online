export type TipoMovimentacao = 'entrada' | 'saida' | 'ajuste' | 'reserva' | 'cancelamento'

export interface ItemEstoque {
  id: number
  produto: string
  sku: string
  categoria: string
  saldoAtual: number
  minimo: number
  reservado: number
  disponivel: number
  ultimaMovimentacao: string
  precoCusto: number
}

export interface MovimentacaoEstoque {
  id: number
  sku: string
  produto: string
  tipo: TipoMovimentacao
  quantidade: number
  saldoAnterior: number
  saldoPosterior: number
  motivo: string
  data: string
  hora: string
  usuario: string
}

export const tipoConfig: Record<TipoMovimentacao, { label: string; cor: string; sinal: '+' | '-' | '±' }> = {
  entrada: { label: 'Entrada', cor: 'text-emerald-700 bg-emerald-50', sinal: '+' },
  saida: { label: 'Saída', cor: 'text-red-700 bg-red-50', sinal: '-' },
  ajuste: { label: 'Ajuste', cor: 'text-blue-700 bg-blue-50', sinal: '±' },
  reserva: { label: 'Reserva', cor: 'text-amber-700 bg-amber-50', sinal: '-' },
  cancelamento: { label: 'Cancelamento', cor: 'text-slate-700 bg-slate-100', sinal: '+' },
}

export const mockEstoque: ItemEstoque[] = [
  { id: 1,  produto: 'Caixa Organizadora 40L',         sku: 'ORG-40L-CZ', categoria: 'Organização', saldoAtual: 45, minimo: 10, reservado: 8,  disponivel: 37, ultimaMovimentacao: '17/03/2026', precoCusto: 3500 },
  { id: 2,  produto: 'Saco de Viagem Compressível',     sku: 'SAC-VIA-AZ', categoria: 'Viagem',      saldoAtual: 12, minimo: 15, reservado: 3,  disponivel: 9,  ultimaMovimentacao: '17/03/2026', precoCusto: 2800 },
  { id: 3,  produto: 'Kit Cabides Slim (20un)',         sku: 'CAB-SLM-20', categoria: 'Organização', saldoAtual: 0,  minimo: 20, reservado: 0,  disponivel: 0,  ultimaMovimentacao: '15/03/2026', precoCusto: 2200 },
  { id: 4,  produto: 'Organizador de Gaveta Modular',   sku: 'GAV-MOD-BR', categoria: 'Organização', saldoAtual: 31, minimo: 10, reservado: 5,  disponivel: 26, ultimaMovimentacao: '16/03/2026', precoCusto: 900  },
  { id: 5,  produto: 'Porta-Documentos A4',             sku: 'DOC-A4-PR',  categoria: 'Escritório',  saldoAtual: 8,  minimo: 10, reservado: 2,  disponivel: 6,  ultimaMovimentacao: '14/03/2026', precoCusto: 1200 },
  { id: 6,  produto: 'Organizador de Armário Vertical', sku: 'ARM-VRT-CZ', categoria: 'Organização', saldoAtual: 5,  minimo: 8,  reservado: 1,  disponivel: 4,  ultimaMovimentacao: '16/03/2026', precoCusto: 3100 },
  { id: 7,  produto: 'Saco a Vácuo Multiuso (3un)',     sku: 'VAC-MUL-3',  categoria: 'Organização', saldoAtual: 3,  minimo: 10, reservado: 1,  disponivel: 2,  ultimaMovimentacao: '17/03/2026', precoCusto: 1600 },
  { id: 8,  produto: 'Suporte para Sapatos Empilhável', sku: 'SAP-EMP-TR', categoria: 'Organização', saldoAtual: 22, minimo: 5,  reservado: 0,  disponivel: 22, ultimaMovimentacao: '10/03/2026', precoCusto: 1100 },
  { id: 9,  produto: 'Porta-Mantimentos Hermético 2L',  sku: 'MAN-HER-2L', categoria: 'Cozinha',     saldoAtual: 0,  minimo: 15, reservado: 0,  disponivel: 0,  ultimaMovimentacao: '12/03/2026', precoCusto: 750  },
  { id: 10, produto: 'Organizador de Pia Premium',      sku: 'PIA-PRM-BC', categoria: 'Cozinha',     saldoAtual: 18, minimo: 8,  reservado: 4,  disponivel: 14, ultimaMovimentacao: '15/03/2026', precoCusto: 2200 },
  { id: 11, produto: 'Caixa Organizadora 20L',          sku: 'ORG-20L-CZ', categoria: 'Organização', saldoAtual: 0,  minimo: 10, reservado: 0,  disponivel: 0,  ultimaMovimentacao: '01/03/2026', precoCusto: 2400 },
  { id: 12, produto: 'Separador de Gaveta Ajustável',   sku: 'SEP-GAV-AJ', categoria: 'Organização', saldoAtual: 45, minimo: 10, reservado: 6,  disponivel: 39, ultimaMovimentacao: '13/03/2026', precoCusto: 600  },
  { id: 13, produto: 'Organizador de Mesa 5 Comp.',     sku: 'MES-5CP-PR', categoria: 'Escritório',  saldoAtual: 9,  minimo: 10, reservado: 2,  disponivel: 7,  ultimaMovimentacao: '14/03/2026', precoCusto: 1500 },
  { id: 14, produto: 'Saco de Viagem Grande (2un)',     sku: 'SAC-VIA-GR', categoria: 'Viagem',      saldoAtual: 0,  minimo: 5,  reservado: 0,  disponivel: 0,  ultimaMovimentacao: '05/03/2026', precoCusto: 3200 },
  { id: 15, produto: 'Organizador de Utensílios Coz.',  sku: 'UTN-COZ-IN', categoria: 'Cozinha',     saldoAtual: 15, minimo: 5,  reservado: 0,  disponivel: 15, ultimaMovimentacao: '10/03/2026', precoCusto: 950  },
]

export const mockMovimentacoes: MovimentacaoEstoque[] = [
  { id: 1,  sku: 'CAB-SLM-20', produto: 'Kit Cabides Slim (20un)',         tipo: 'saida',       quantidade: 6,  saldoAnterior: 6,  saldoPosterior: 0,  motivo: 'Pedido #4516 – venda confirmada',      data: '16/03/2026', hora: '15:22', usuario: 'Sistema' },
  { id: 2,  sku: 'ORG-40L-CZ', produto: 'Caixa Organizadora 40L',         tipo: 'entrada',     quantidade: 30, saldoAnterior: 15, saldoPosterior: 45, motivo: 'Reposição de estoque – NF 00487',       data: '15/03/2026', hora: '09:10', usuario: 'Adriana P.' },
  { id: 3,  sku: 'SAC-VIA-AZ', produto: 'Saco de Viagem Compressível',    tipo: 'saida',       quantidade: 2,  saldoAnterior: 14, saldoPosterior: 12, motivo: 'Pedido #4520 – enviado',                data: '17/03/2026', hora: '11:05', usuario: 'Sistema' },
  { id: 4,  sku: 'MAN-HER-2L', produto: 'Porta-Mantimentos Hermético 2L', tipo: 'saida',       quantidade: 8,  saldoAnterior: 8,  saldoPosterior: 0,  motivo: 'Pedidos #4498, #4501, #4506 – saída',   data: '12/03/2026', hora: '14:30', usuario: 'Sistema' },
  { id: 5,  sku: 'VAC-MUL-3',  produto: 'Saco a Vácuo Multiuso (3un)',    tipo: 'ajuste',      quantidade: -3, saldoAnterior: 6,  saldoPosterior: 3,  motivo: 'Divergência no inventário – ajuste',    data: '17/03/2026', hora: '08:45', usuario: 'Carlos D.' },
  { id: 6,  sku: 'GAV-MOD-BR', produto: 'Organizador de Gaveta Modular',  tipo: 'reserva',     quantidade: 5,  saldoAnterior: 36, saldoPosterior: 31, motivo: 'Pedido #4519 – aguardando pagamento',   data: '17/03/2026', hora: '09:05', usuario: 'Sistema' },
  { id: 7,  sku: 'ARM-VRT-CZ', produto: 'Organizador de Armário Vertical',tipo: 'saida',       quantidade: 3,  saldoAnterior: 8,  saldoPosterior: 5,  motivo: 'Pedidos #4510, #4511 – saída estoque',  data: '16/03/2026', hora: '16:00', usuario: 'Sistema' },
  { id: 8,  sku: 'DOC-A4-PR',  produto: 'Porta-Documentos A4',            tipo: 'saida',       quantidade: 2,  saldoAnterior: 10, saldoPosterior: 8,  motivo: 'Pedido #4517 – cancelado mas saiu',     data: '16/03/2026', hora: '08:30', usuario: 'Sistema' },
  { id: 9,  sku: 'ORG-40L-CZ', produto: 'Caixa Organizadora 40L',         tipo: 'saida',       quantidade: 4,  saldoAnterior: 49, saldoPosterior: 45, motivo: 'Pedidos #4518, #4521 – saída',          data: '16/03/2026', hora: '14:45', usuario: 'Sistema' },
  { id: 10, sku: 'SEP-GAV-AJ', produto: 'Separador de Gaveta Ajustável',  tipo: 'entrada',     quantidade: 20, saldoAnterior: 25, saldoPosterior: 45, motivo: 'Reposição de estoque – NF 00482',       data: '13/03/2026', hora: '10:30', usuario: 'Adriana P.' },
  { id: 11, sku: 'PIA-PRM-BC', produto: 'Organizador de Pia Premium',     tipo: 'reserva',     quantidade: 4,  saldoAnterior: 22, saldoPosterior: 18, motivo: 'Pedidos #4508, #4512 – reservados',     data: '15/03/2026', hora: '12:15', usuario: 'Sistema' },
  { id: 12, sku: 'MES-5CP-PR', produto: 'Organizador de Mesa 5 Comp.',    tipo: 'saida',       quantidade: 2,  saldoAnterior: 11, saldoPosterior: 9,  motivo: 'Pedido #4513 – entregue',               data: '14/03/2026', hora: '09:00', usuario: 'Sistema' },
  { id: 13, sku: 'SAC-VIA-AZ', produto: 'Saco de Viagem Compressível',    tipo: 'cancelamento',quantidade: 1,  saldoAnterior: 11, saldoPosterior: 12, motivo: 'Pedido #4504 cancelado – estorno',      data: '16/03/2026', hora: '17:30', usuario: 'Sistema' },
  { id: 14, sku: 'CAB-SLM-20', produto: 'Kit Cabides Slim (20un)',         tipo: 'ajuste',      quantidade: -5, saldoAnterior: 11, saldoPosterior: 6,  motivo: 'Avaria identificada em inspeção',       data: '14/03/2026', hora: '11:20', usuario: 'Carlos D.' },
  { id: 15, sku: 'ORG-40L-CZ', produto: 'Caixa Organizadora 40L',         tipo: 'saida',       quantidade: 2,  saldoAnterior: 51, saldoPosterior: 49, motivo: 'Pedido #4514 – enviado',                data: '15/03/2026', hora: '10:15', usuario: 'Sistema' },
]

export function getEstoqueStatus(item: ItemEstoque): { label: string; variant: 'danger' | 'warning' | 'success'; nivel: 'zero' | 'critico' | 'baixo' | 'normal' } {
  if (item.saldoAtual === 0) return { label: 'Sem estoque', variant: 'danger', nivel: 'zero' }
  if (item.saldoAtual <= item.minimo) return { label: 'Crítico', variant: 'danger', nivel: 'critico' }
  if (item.saldoAtual <= item.minimo * 2) return { label: 'Baixo', variant: 'warning', nivel: 'baixo' }
  return { label: 'Normal', variant: 'success', nivel: 'normal' }
}
