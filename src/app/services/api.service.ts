import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  FinancialRecordDto, CreateFinancialRecordRequest, UpdateFinancialRecordRequest,
  SalaryDto, CreateSalaryRequest, DashboardSummaryDto
} from '../models/financial.model';
import { UserDto } from '../models/user.model';

const D = '2026-01-01T00:00:00';

const LANCAMENTOS: FinancialRecordDto[] = [
  { id: '1',  tipo: 'Entrada',  mes: 4, ano: 2026, dataLancamento: '2026-04-05', categoria: 'Salário',      descricao: 'Salário HYTI Abril',         valor: 8500,  pago: true,  criadoEm: D },
  { id: '2',  tipo: 'Entrada',  mes: 4, ano: 2026, dataLancamento: '2026-04-10', categoria: 'Freelance',    descricao: 'Projeto site cliente',        valor: 2200,  pago: true,  criadoEm: D },
  { id: '3',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-02', categoria: 'Aluguel',      descricao: 'Aluguel apartamento',         valor: 1800,  pago: true,  criadoEm: D },
  { id: '4',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-05', categoria: 'Escola',       descricao: 'Mensalidade Escola Lucas',    valor: 950,   pago: true,  criadoEm: D },
  { id: '5',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-05', categoria: 'Escola',       descricao: 'Mensalidade Escola Ana',      valor: 950,   pago: false, criadoEm: D },
  { id: '6',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-10', categoria: 'Alimentação',  descricao: 'Supermercado',                valor: 780,   pago: true,  criadoEm: D },
  { id: '7',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-15', categoria: 'Saúde',        descricao: 'Plano de saúde família',      valor: 620,   pago: true,  criadoEm: D },
  { id: '8',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-20', categoria: 'Transporte',   descricao: 'Combustível',                 valor: 350,   pago: false, criadoEm: D },
  { id: '9',  tipo: 'Despesa',  mes: 4, ano: 2026, dataLancamento: '2026-04-22', categoria: 'Lazer',        descricao: 'Cinema e jantar família',     valor: 280,   pago: true,  criadoEm: D },
  { id: '10', tipo: 'Entrada',  mes: 3, ano: 2026, dataLancamento: '2026-03-05', categoria: 'Salário',      descricao: 'Salário HYTI Março',          valor: 8500,  pago: true,  criadoEm: D },
  { id: '11', tipo: 'Despesa',  mes: 3, ano: 2026, dataLancamento: '2026-03-02', categoria: 'Aluguel',      descricao: 'Aluguel apartamento',         valor: 1800,  pago: true,  criadoEm: D },
  { id: '12', tipo: 'Despesa',  mes: 3, ano: 2026, dataLancamento: '2026-03-10', categoria: 'Alimentação',  descricao: 'Supermercado',                valor: 820,   pago: true,  criadoEm: D },
];

const SALARIOS: SalaryDto[] = [
  { id: '1', mes: 1, ano: 2026, valor: 8500, descricao: 'Salário líquido HYTI', criadoEm: D, atualizadoEm: D },
  { id: '2', mes: 2, ano: 2026, valor: 8500, descricao: 'Salário líquido HYTI', criadoEm: D, atualizadoEm: D },
  { id: '3', mes: 3, ano: 2026, valor: 8500, descricao: 'Salário líquido HYTI', criadoEm: D, atualizadoEm: D },
  { id: '4', mes: 4, ano: 2026, valor: 8500, descricao: 'Salário líquido HYTI', criadoEm: D, atualizadoEm: D },
];

const USUARIOS: UserDto[] = [
  { id: 'u1', name: 'Carlos Souza',    email: 'carlos@email.com', isApproved: false, isAdmin: false, createdAt: '2026-04-25T10:30:00' },
  { id: 'u2', name: 'Maria Oliveira',  email: 'maria@email.com',  isApproved: false, isAdmin: false, createdAt: '2026-04-26T14:20:00' },
];

let lancamentos = [...LANCAMENTOS];
let salarios    = [...SALARIOS];
let usuarios    = [...USUARIOS];
let nextId      = 100;

@Injectable({ providedIn: 'root' })
export class ApiService {

  getResumo(mes: number, ano: number): Observable<DashboardSummaryDto> {
    const reg      = lancamentos.filter(r => r.mes === mes && r.ano === ano);
    const entradas = reg.filter(r => r.tipo === 'Entrada').reduce((s, r) => s + r.valor, 0);
    const despesas = reg.filter(r => r.tipo === 'Despesa').reduce((s, r) => s + r.valor, 0);
    const salario  = salarios.find(s => s.mes === mes && s.ano === ano)?.valor ?? 0;
    const catMap   = new Map<string, number>();
    reg.filter(r => r.tipo === 'Despesa').forEach(r => catMap.set(r.categoria, (catMap.get(r.categoria) ?? 0) + r.valor));
    const topDespesas = Array.from(catMap.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total).slice(0, 5);
    return of({
      mes, ano, salario,
      totalEntradas: entradas,
      totalDespesas: despesas,
      saldo: entradas - despesas,
      totalLancamentos: reg.length,
      lancamentosPagos: reg.filter(r => r.pago).length,
      lancamentosPendentes: reg.filter(r => !r.pago).length,
      topDespesas
    });
  }

  getLancamentos(mes?: number, ano?: number, tipo?: string): Observable<FinancialRecordDto[]> {
    let result = [...lancamentos];
    if (mes)  result = result.filter(r => r.mes === mes);
    if (ano)  result = result.filter(r => r.ano === ano);
    if (tipo) result = result.filter(r => r.tipo.toLowerCase() === tipo.toLowerCase());
    return of(result);
  }

  createLancamento(req: CreateFinancialRecordRequest): Observable<FinancialRecordDto> {
    const novo: FinancialRecordDto = { id: String(++nextId), ...req, criadoEm: new Date().toISOString() };
    lancamentos = [...lancamentos, novo];
    return of(novo);
  }

  updateLancamento(id: string, req: UpdateFinancialRecordRequest): Observable<FinancialRecordDto> {
    lancamentos = lancamentos.map(r => r.id === id ? { ...r, ...req } : r);
    return of(lancamentos.find(r => r.id === id)!);
  }

  deleteLancamento(id: string): Observable<void> {
    lancamentos = lancamentos.filter(r => r.id !== id);
    return of(void 0);
  }

  getSalarios(ano?: number): Observable<SalaryDto[]> {
    return of(ano ? salarios.filter(s => s.ano === ano) : salarios);
  }

  getSalarioMes(mes: number, ano: number): Observable<SalaryDto> {
    return of(salarios.find(s => s.mes === mes && s.ano === ano)!);
  }

  saveSalario(req: CreateSalaryRequest): Observable<SalaryDto> {
    const agora = new Date().toISOString();
    const existe = salarios.find(s => s.mes === req.mes && s.ano === req.ano);
    if (existe) {
      salarios = salarios.map(s => s.mes === req.mes && s.ano === req.ano ? { ...s, ...req, atualizadoEm: agora } : s);
      return of(salarios.find(s => s.mes === req.mes && s.ano === req.ano)!);
    }
    const novo: SalaryDto = { id: String(++nextId), ...req, criadoEm: agora, atualizadoEm: agora };
    salarios = [...salarios, novo];
    return of(novo);
  }

  deleteSalario(id: string): Observable<void> {
    salarios = salarios.filter(s => s.id !== id);
    return of(void 0);
  }

  getPendingUsers(): Observable<UserDto[]> {
    return of(usuarios.filter(u => !u.isApproved));
  }

  approveUser(id: string): Observable<void> {
    usuarios = usuarios.map(u => u.id === id ? { ...u, isApproved: true } : u);
    return of(void 0);
  }
}
