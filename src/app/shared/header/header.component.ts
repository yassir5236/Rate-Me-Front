import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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

  constructor( private router: Router ,private authService :AuthService ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;

    });
    };
  }





