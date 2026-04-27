import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email    = '';
  password = '';
  loading  = false;
  erro     = '';

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isAuthenticated()) router.navigate(['/home']);
  }

  async submit() {
    if (!this.email || !this.password) { this.erro = 'Preencha e-mail e senha.'; return; }
    this.loading = true; this.erro = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => { this.erro = 'E-mail ou senha incorretos.'; this.loading = false; }
    });
  }
}
