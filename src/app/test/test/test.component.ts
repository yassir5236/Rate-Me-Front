import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-test',
  imports: [RouterLink],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

    constructor(private authService: AuthService , private router: Router) {
    }
  test() {
    this.authService.test().subscribe(
      response => {
        console.log('Réponse du serveur:', response);
        alert(response); // Affiche la réponse dans une alerte
      },
      error => {
        console.error('Erreur lors de l’appel à test:', error);
        alert('Erreur lors de l’appel au backend.');
      }
    );
  
}}
