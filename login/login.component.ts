import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  recaptchaResponse = ''; // ✅ Ajout du token reCAPTCHA
  errorMessage = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    
  ) {}

  ngOnInit(): void {
    this.messageService.message$.subscribe((message: string | null) => {
      if (message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
    });
  }

  // ✅ Cette méthode est appelée par <re-captcha (resolved)="onCaptchaResolved($event)">
  onCaptchaResolved(token: string) {
    this.recaptchaResponse = token;
  }

  login(): void {
    if (!this.recaptchaResponse) {
      this.errorMessage = 'Veuillez valider le reCAPTCHA.';
      return;
    }

    this.authService.login(this.email, this.password, this.recaptchaResponse).subscribe({
      next: (success) => {
        if (success) {
          const role = localStorage.getItem('role');

          switch (role) {
            case 'ADMIN':
              this.router.navigate(['/dashboard']);
              break;
            case 'GUIDE':
              this.router.navigate(['/reservationsbyguide']);
              break;
            case 'PARTNER':
              this.router.navigate(['/partnerdashboard']);
              break;
            case 'USER':
            default:
              this.router.navigate(['/blog']);
              break;
          }
        } else {
          this.errorMessage = this.authService.errorMessage || 'Identifiants invalides';
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
        console.error('Erreur de connexion :', err);
      }
    });
  }
}
