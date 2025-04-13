import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';  // Service d'authentification
import { User } from 'src/app/models/user.model';  // Assurez-vous que User est bien défini dans vos modèles

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  user: User | null = null;  // Définir la variable 'user'

  email: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.email = this.authService.getCurrentUserEmail();
  }

  get isUserManagementPage(): boolean {
    return this.router.url.includes('/list-users') || 
           this.router.url.includes('/add-user');
  }
  

  goToProfile(): void {
    if (this.user?.id) {
      this.router.navigate(['/profile', this.user.id]);
    } else {
      console.error('User is not authenticated');
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirection après déconnexion
  }

}  
