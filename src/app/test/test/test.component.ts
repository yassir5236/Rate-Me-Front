// home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  popularDestinations = [
    {
      name: 'Pasar Raya Tour JOGM',
      location: 'Yogyakarta',
      image: 'assets/images/yogyakarta.jpg',
      price: 276000,
      rating: 4.9,
      reviews: 12000
    },
    {
      name: 'Farmstay Glamping Di Bogor',
      location: 'Bogor',
      image: 'assets/images/bogor.jpg',
      price: 287000,
      rating: 4.8,
      reviews: 7400
    },
    {
      name: 'Paket Tour Puncak Gunung Bali',
      location: 'Bali',
      image: 'assets/images/bali.jpg',
      price: 312000,
      rating: 4.6,
      reviews: 9600
    },
    {
      name: 'Desa Wisata Bawati',
      location: 'Bawati',
      image: 'assets/images/bawati.jpg',
      price: 247000,
      rating: 4.7,
      reviews: 8900
    }
  ];

  services = [
    {
      name: 'Flight Ticket',
      description: 'View above performance difference at vehicle sector',
      icon: 'assets/icons/flight.svg'
    },
    {
      name: 'Accommodation',
      description: 'View above performance difference at vehicle sector',
      icon: 'assets/icons/accommodation.svg'
    },
    {
      name: 'Packaged Tour',
      description: 'View above performance difference at vehicle sector',
      icon: 'assets/icons/package.svg'
    }
  ];
}