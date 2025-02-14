import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.authService.login(user).subscribe(
        (response) => {
          console.log(response); // Success, handle the response
          localStorage.setItem('token', response.token); // Stocke le token

          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error(error);
          // Display error message to the user
          alert(error.error || 'An error occurred during login.');
        }
      );
    }
  }

  test() {
    this.authService.test().subscribe(
      (response) => {
        console.log('Réponse du serveur:', response);
        alert(response); // Affiche la réponse dans une alerte
      },
      (error) => {
        console.error('Erreur lors de l’appel à test:', error);
        alert('Erreur lors de l’appel au backend.');
      }
    );
  }


}
