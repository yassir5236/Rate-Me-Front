import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialisation de la carte sur un point spécifique (Paris par défaut)
    this.map = L.map('map').setView([48.8566, 2.3522], 12);

    // Ajout de la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Ajout d'un marqueur sur la position par défaut
    const marker = L.marker([48.8566, 2.3522])
      .addTo(this.map)
      .bindPopup('Bienvenue à Paris !')
      .openPopup();

    // Écoute des clics sur la carte pour placer un marqueur interactif
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.latlng;
      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`)
        .openPopup();
    });
  }
}
