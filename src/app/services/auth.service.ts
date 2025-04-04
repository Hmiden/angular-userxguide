import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; // Ajout du Router
import { of as observableOf } from 'rxjs';
import { MessageService } from 'src/app/services/message.service'; // Importer le service de message


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8089/tourisme/auth/login';
  private registerUrl = 'http://localhost:8089/tourisme/auth/signup';
  private Reset = 'http://localhost:8089/tourisme/api/users';

  private tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<string | null>(this.getToken());
  user$ = this.userSubject.asObservable(); // Observable pour suivre l'état de connexion
  errorMessage: string = ''; // Variable pour gérer les erreurs

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private messageService: MessageService // Injecter MessageService
  ) {}

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.Reset}/forgot-password`, null, {
      params: { email }
    }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.Reset}/validate-token`, {
      params: { token }
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.Reset}/reset-password`, {
      token,
      newPassword
    });
  }
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(this.loginUrl, { email, password }).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.userSubject.next(response.token);
          return true;
        }
        return false;
      }),
      catchError(err => {
        this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        console.error('Erreur lors de la connexion :', err);
        return observableOf(false); // Retourne false en cas d'erreur
      })
    );
  }

  

  // Méthode pour s'enregistrer via OAuth2 (Google par exemple)
  registerWithOAuth2(): Observable<any> {
    return this.http.get<any>('http://localhost:8089/tourisme/oauth2/authorization/google', { observe: 'response' }).pipe(
      map(response => {
        console.log('Réponse du serveur : ', response); // Vérifie la réponse du backend
        if (response.body && response.body.message) {
          alert(response.body.message); // Affiche le message du backend
        } else {
          alert('Compte créé avec succès !');
        }

        // Utilise MessageService pour transmettre le message
        this.messageService.setMessage('Compte créé avec succès. Un email avec un mot de passe temporaire a été envoyé. Veuillez vérifier votre email et vous connecter avec ce mot de passe. Une fois connecté, vous pourrez modifier votre mot de passe.');

        // Redirection vers la page de login
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        // Gérer l'erreur en affichant un message d'erreur
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Erreur :', err);
        return observableOf(null); // Retourner null en cas d'erreur
      })
    );
  }

  // Gérer la réponse OAuth2 et stocker le token dans le localStorage
  handleOAuth2Response(message: string): void {
    // Afficher le message reçu du backend après une inscription réussie
    alert(message);
    this.router.navigate(['/login']);  // Rediriger vers la page de connexion après l'alerte
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Méthode pour l'inscription classique avec des données utilisateur
  register(userData: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData).pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error('Erreur lors de l\'inscription :', err);
        return observableOf(null); // Retourner null en cas d'erreur
      })
    );
  }
}
