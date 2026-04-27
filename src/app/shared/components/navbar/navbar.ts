import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  collapsed = signal(false);

  constructor(public auth: AuthService, private router: Router) {}

  toggle() { this.collapsed.update(v => !v); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get user() { return this.auth.getUser(); }
  get initials() {
    const name = this.user?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
