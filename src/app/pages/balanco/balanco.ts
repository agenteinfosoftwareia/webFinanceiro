import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balanco',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balanco.html',
  styleUrl: './balanco.scss'
})
export class BalancoComponent {
  tabAtiva = 'resumo';
  setTab(t: string) { this.tabAtiva = t; }
}
