import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SalaryDto } from '../../models/financial.model';

@Component({
  selector: 'app-salario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salario.html',
  styleUrl: './salario.scss'
})
export class SalarioComponent implements OnInit {
  salarios: SalaryDto[] = [];
  loading = false; showModal = false; salvando = false; showConfirm = false;
  anoFiltro = new Date().getFullYear(); erro = '';
  anos = [2024, 2025, 2026, 2027];
  meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  excluindo: SalaryDto | null = null;
  form = this.novoForm();

  constructor(private api: ApiService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getSalarios(this.anoFiltro).subscribe({
      next: r  => { this.salarios = r; this.loading = false; },
      error: () => { this.salarios = []; this.loading = false; }
    });
  }

  novoOuEditar(s?: SalaryDto) {
    this.form = s ? { mes: s.mes, ano: s.ano, valor: s.valor, descricao: s.descricao } : this.novoForm();
    this.erro = ''; this.showModal = true;
  }

  salvar() {
    if (this.form.valor <= 0) { this.erro = 'Informe um valor válido.'; return; }
    this.salvando = true; this.erro = '';
    this.api.saveSalario(this.form).subscribe({
      next: () => { this.showModal = false; this.salvando = false; this.carregar(); },
      error: () => { this.erro = 'Erro ao salvar.'; this.salvando = false; }
    });
  }

  confirmarExclusao(s: SalaryDto) { this.excluindo = s; this.showConfirm = true; }
  excluir() {
    if (!this.excluindo) return;
    this.api.deleteSalario(this.excluindo.id).subscribe(() => { this.showConfirm = false; this.carregar(); });
  }

  fmt(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  nomeMes(m: number) { return this.meses[m - 1] ?? m; }
  novoForm() { return { mes: new Date().getMonth()+1, ano: new Date().getFullYear(), valor: 0, descricao: '' }; }
}
