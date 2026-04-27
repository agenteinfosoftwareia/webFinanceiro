import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FinancialRecordDto, CreateFinancialRecordRequest, UpdateFinancialRecordRequest } from '../../models/financial.model';

@Component({
  selector: 'app-lancamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamentos.html',
  styleUrl: './lancamentos.scss'
})
export class LancamentosComponent implements OnInit {
  registros: FinancialRecordDto[] = [];
  loading = false; showModal = false; salvando = false; showConfirm = false;
  mes = new Date().getMonth() + 1; ano = new Date().getFullYear();
  tipo = ''; busca = ''; erro = '';
  meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  anos  = [2024, 2025, 2026, 2027];

  editando: FinancialRecordDto | null = null;
  excluindo: FinancialRecordDto | null = null;
  form = this.novoForm();

  constructor(private api: ApiService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getLancamentos(this.mes || undefined, this.ano || undefined, this.tipo || undefined).subscribe({
      next: r  => { this.registros = r; this.loading = false; },
      error: () => { this.registros = []; this.loading = false; }
    });
  }

  get filtrados() {
    if (!this.busca) return this.registros;
    const b = this.busca.toLowerCase();
    return this.registros.filter(r => r.categoria.toLowerCase().includes(b) || r.descricao.toLowerCase().includes(b));
  }

  editar(r: FinancialRecordDto) {
    this.editando = r;
    this.form = { tipo: r.tipo, mes: r.mes, ano: r.ano, dataLancamento: r.dataLancamento.substring(0,10), categoria: r.categoria, descricao: r.descricao, valor: r.valor, pago: r.pago };
    this.erro = ''; this.showModal = true;
  }

  novo() {
    this.editando = null;
    this.form = this.novoForm();
    this.erro = ''; this.showModal = true;
  }

  salvar() {
    if (!this.form.categoria) { this.erro = 'Informe a categoria.'; return; }
    if (this.form.valor <= 0) { this.erro = 'Informe um valor válido.'; return; }
    this.salvando = true; this.erro = '';
    const req = { ...this.form };
    const obs = this.editando
      ? this.api.updateLancamento(this.editando.id, req as UpdateFinancialRecordRequest)
      : this.api.createLancamento(req as CreateFinancialRecordRequest);
    obs.subscribe({
      next: () => { this.showModal = false; this.salvando = false; this.carregar(); },
      error: () => { this.erro = 'Erro ao salvar.'; this.salvando = false; }
    });
  }

  confirmarExclusao(r: FinancialRecordDto) { this.excluindo = r; this.showConfirm = true; }

  excluir() {
    if (!this.excluindo) return;
    this.api.deleteLancamento(this.excluindo.id).subscribe(() => { this.showConfirm = false; this.carregar(); });
  }

  fmt(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  nomeMes(m: number) { return this.meses[m - 1] ?? m; }
  novoForm() { return { tipo: 'Despesa', mes: new Date().getMonth()+1, ano: new Date().getFullYear(), dataLancamento: new Date().toISOString().substring(0,10), categoria: '', descricao: '', valor: 0, pago: false }; }
}
