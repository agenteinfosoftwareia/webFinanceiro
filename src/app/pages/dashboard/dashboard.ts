import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardSummaryDto } from '../../models/financial.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  mes = new Date().getMonth() + 1;
  ano = new Date().getFullYear();
  resumo: DashboardSummaryDto | null = null;
  loading = false;

  meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  anos  = [2024, 2025, 2026, 2027];

  constructor(private api: ApiService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getResumo(this.mes, this.ano).subscribe({
      next: r  => { this.resumo = r; this.loading = false; },
      error: () => { this.resumo = null; this.loading = false; }
    });
  }

  fmt(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  nomeMes(m: number) { return this.meses[m - 1] ?? m; }
}
