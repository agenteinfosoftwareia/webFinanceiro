import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  name     = '';
  email    = '';
  password = '';
  loading  = false;
  erro     = '';
  sucesso  = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.name || !this.email || !this.password) { this.erro = 'Preencha todos os campos.'; return; }
    this.loading = true; this.erro = '';
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => { this.sucesso = true; this.loading = false; },
      error: () => { this.erro = 'Erro ao cadastrar. Tente novamente.'; this.loading = false; }
    });
  }
}
