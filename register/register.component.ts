import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nTel: ['', Validators.required],
      numPasseport: ['', Validators.required],
      role: ['user', Validators.required] // Default value
    });
  }

  registerWithOAuth2() {
    window.location.href = 'http://localhost:8089/tourisme/oauth2/authorization/google';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const selectedRole = this.registerForm.value.role;

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          if (selectedRole === 'guide' || selectedRole === 'partner') {
            this.successMessage = 'Votre inscription est en attente de validation par un administrateur.';
          } else {
            this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          }

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // petite pause avant la redirection
        },
        error: () => {
          this.errorMessage = 'Échec de l’inscription. Veuillez réessayer.';
        }
      });
    }
  }
}
