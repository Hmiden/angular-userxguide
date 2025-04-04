import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service'; // Importer le MessageService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage: string = ''; // Assure-toi de déclarer explicitement le type

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService // Injecter le MessageService
  ) {}

  ngOnInit(): void {
    // Abonnement au message du MessageService
    this.messageService.message$.subscribe((message: string | null) => {
      if (message) {
        this.successMessage = message; // Recevoir et afficher le message de succès si ce n'est pas null
        setTimeout(() => {
          this.successMessage = ''; // Masquer le message après un certain temps
        }, 5000); // Le message sera masqué après 5 secondes
      }
    });
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/']); // Redirection vers la page d'accueil en cas de succès
        } else {
          this.errorMessage = 'Identifiants invalides'; // Afficher un message d'erreur
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.'; // Afficher l'erreur générale si la requête échoue
        console.error('Erreur de connexion :', err);
      }
    });
  }
}
