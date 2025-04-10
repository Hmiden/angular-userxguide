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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur actuel via AuthService
    this.user = this.authService.getCurrentUser();
  
    if (!this.user?.id) {
      console.error('User ID is not available.');
    }
  }
  

  goToProfile(): void {
    if (this.user?.id) {
      this.router.navigate(['/profile', this.user.id]);
    } else {
      console.error('User is not authenticated');
    }
  }
}  
