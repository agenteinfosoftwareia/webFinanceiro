import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FinancialRecordDto, CreateFinancialRecordRequest, UpdateFinancialRecordRequest,
  SalaryDto, CreateSalaryRequest, DashboardSummaryDto
} from '../models/financial.model';
import { UserDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = `${environment.apiUrl}/api/financeiro`;
  private usersBase = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  // === DASHBOARD ===

  getResumo(mes: number, ano: number): Observable<DashboardSummaryDto> {
    const params = new HttpParams().set('mes', mes).set('ano', ano);
    return this.http.get<DashboardSummaryDto>(`${this.base}/resumo`, { params });
  }

  // === LANÇAMENTOS ===

  getLancamentos(mes?: number, ano?: number, tipo?: string): Observable<FinancialRecordDto[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes);
    if (ano) params = params.set('ano', ano);
    if (tipo) params = params.set('tipo', tipo);
    return this.http.get<FinancialRecordDto[]>(`${this.base}/lancamentos`, { params });
  }

  createLancamento(req: CreateFinancialRecordRequest): Observable<FinancialRecordDto> {
    return this.http.post<FinancialRecordDto>(`${this.base}/lancamentos`, req);
  }

  updateLancamento(id: string, req: UpdateFinancialRecordRequest): Observable<FinancialRecordDto> {
    return this.http.put<FinancialRecordDto>(`${this.base}/lancamentos/${id}`, req);
  }

  deleteLancamento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/lancamentos/${id}`);
  }

  // === SALÁRIOS ===

  getSalarios(ano?: number): Observable<SalaryDto[]> {
    let params = new HttpParams();
    if (ano) params = params.set('ano', ano);
    return this.http.get<SalaryDto[]>(`${this.base}/salarios`, { params });
  }

  getSalarioMes(mes: number, ano: number): Observable<SalaryDto> {
    return this.http.get<SalaryDto>(`${this.base}/salarios/${mes}/${ano}`);
  }

  saveSalario(req: CreateSalaryRequest): Observable<SalaryDto> {
    return this.http.post<SalaryDto>(`${this.base}/salarios`, req);
  }

  deleteSalario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/salarios/${id}`);
  }

  // === USUÁRIOS ===

  getPendingUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.usersBase}/pending`);
  }

  approveUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.usersBase}/${id}/approve`, null);
  }
}
