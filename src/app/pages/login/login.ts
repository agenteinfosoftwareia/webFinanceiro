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
    this.loading = true;
    this.auth.login({ email: this.email || 'demo@hyti.com.br', password: this.password || '123' }).subscribe({
      next: () => this.router.navigate(['/home'])
    });
  }
}
