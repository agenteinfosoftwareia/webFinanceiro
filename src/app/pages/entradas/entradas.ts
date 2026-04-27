import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FinancialRecordDto, CreateFinancialRecordRequest, UpdateFinancialRecordRequest } from '../../models/financial.model';

@Component({
  selector: 'app-entradas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entradas.html',
  styleUrl: './entradas.scss'
})
export class EntradasComponent implements OnInit {
  registros: FinancialRecordDto[] = [];
  loading = false; showModal = false; salvando = false; showConfirm = false;
  mes = new Date().getMonth() + 1; ano = new Date().getFullYear();
  filtroCategoria = ''; erro = '';
  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  anos  = [2024, 2025, 2026, 2027];
  editando: FinancialRecordDto | null = null;
  excluindo: FinancialRecordDto | null = null;
  form = this.novoForm();

  constructor(private api: ApiService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getLancamentos(this.mes, this.ano, 'Entrada').subscribe({
      next: r  => { this.registros = r; this.loading = false; },
      error: () => { this.registros = []; this.loading = false; }
    });
  }

  get filtrados() {
    if (!this.filtroCategoria) return this.registros;
    return this.registros.filter(r => r.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase()));
  }

  novo() { this.editando = null; this.form = this.novoForm(); this.erro = ''; this.showModal = true; }

  editar(r: FinancialRecordDto) {
    this.editando = r;
    this.form = { categoria: r.categoria, descricao: r.descricao, valor: r.valor, pago: r.pago, dataLancamento: r.dataLancamento.substring(0,10), mes: r.mes, ano: r.ano };
    this.erro = ''; this.showModal = true;
  }

  salvar() {
    if (!this.form.categoria) { this.erro = 'Informe a categoria.'; return; }
    if (this.form.valor <= 0) { this.erro = 'Informe um valor válido.'; return; }
    this.salvando = true; this.erro = '';
    const body = { tipo: 'Entrada', ...this.form };
    const obs = this.editando
      ? this.api.updateLancamento(this.editando.id, body as UpdateFinancialRecordRequest)
      : this.api.createLancamento(body as CreateFinancialRecordRequest);
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
  novoForm() { return { categoria: '', descricao: '', valor: 0, pago: false, dataLancamento: new Date().toISOString().substring(0,10), mes: new Date().getMonth()+1, ano: new Date().getFullYear() }; }
}
