export interface FinancialRecordDto {
  id: string;
  tipo: string;
  mes: number;
  ano: number;
  dataLancamento: string;
  categoria: string;
  descricao: string;
  valor: number;
  pago: boolean;
  criadoEm: string;
}

export interface CreateFinancialRecordRequest {
  tipo: string;
  mes: number;
  ano: number;
  dataLancamento: string;
  categoria: string;
  descricao: string;
  valor: number;
  pago: boolean;
}

export interface UpdateFinancialRecordRequest extends CreateFinancialRecordRequest {}

export interface SalaryDto {
  id: string;
  mes: number;
  ano: number;
  valor: number;
  descricao: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateSalaryRequest {
  mes: number;
  ano: number;
  valor: number;
  descricao: string;
}

export interface ResumoCategoriaDto {
  categoria: string;
  total: number;
}

export interface DashboardSummaryDto {
  mes: number;
  ano: number;
  salario: number;
  totalEntradas: number;
  totalDespesas: number;
  saldo: number;
  totalLancamentos: number;
  lancamentosPagos: number;
  lancamentosPendentes: number;
  topDespesas: ResumoCategoriaDto[];
}
