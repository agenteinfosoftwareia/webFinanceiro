import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserDto } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  pendentes: UserDto[] = [];
  loading = false;
  aprovando: string | null = null;

  constructor(private api: ApiService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getPendingUsers().subscribe({
      next: r => { this.pendentes = r; this.loading = false; },
      error: () => { this.pendentes = []; this.loading = false; }
    });
  }

  aprovar(id: string) {
    this.aprovando = id;
    this.api.approveUser(id).subscribe({
      next: () => { this.aprovando = null; this.carregar(); },
      error: () => { this.aprovando = null; }
    });
  }

  iniciais(nome: string = '') {
    return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
