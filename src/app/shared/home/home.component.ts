import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-home',
  imports: [RouterLink , CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      transition(':enter', [
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  showCard: boolean = false;
  @ViewChild('infoCard') infoCard!: ElementRef;




    constructor(
      private authService: AuthService,
      private router: Router,
      private cdRef: ChangeDetectorRef
    ) {

    }
  
  ngOnInit() {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
      this.cdRef.detectChanges();
    });
  }

  toggleCard() {
    this.showCard = !this.showCard;
    setTimeout(() => {
      if (this.showCard && this.infoCard) {
        this.infoCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

}
