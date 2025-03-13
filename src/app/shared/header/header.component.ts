import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  user: any = null;
  userRole: string = '';
  isMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
      // this.userRole = this.authService.getRole();

      this.userService.getUserProfile().subscribe(data => {
         this.userRole=data.role;
      });
    
    });
  }


  // ngOnInit(): void {
  //   this.authService.isLoggedIn().subscribe((status) => {
  //     this.isLoggedIn = status;
  
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       this.userService.getUserProfile().subscribe(
  //         (data) => {
  //           this.userRole = data.role;
  //         },
  //         (error) => {
  //           console.error('Erreur lors de la récupération du profil utilisateur :', error);
  //           // Rediriger vers la page de connexion si le token est expiré
  //           this.authService.logout();
  //           this.router.navigate(['/login']);
  //         }
  //       );
  //     } else {
  //       console.error('Token non trouvé dans le localStorage');
  //       this.authService.logout();
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }


  

  logout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        this.authService.logout();
    }
}
}

