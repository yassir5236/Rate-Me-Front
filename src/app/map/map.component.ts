import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Place } from '../services/place.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
     <div class="relative w-full h-[400px]">
      <div #mapContainer class="h-full w-full rounded-lg z-10 border border-gray-300 dark:border-gray-600"></div>
      <div class="absolute top-3 right-3 z-20 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md flex flex-col gap-2">
        <div class="flex gap-2">
          <input
            #searchInput
            type="text"
            placeholder="Rechercher un lieu..."
            class="p-2 border text-amber-50 border-gray-300 rounded-lg flex-grow"
          />
          <button
            type="button"
            (click)="searchPlace(searchInput.value)"
            class="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Rechercher
          </button>
        </div>
        <button 
          type="button" 
          (click)="findMyLocation()"
          class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          Ma Position
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-height: 1000px;
      overflow: hidden;
    }
  `],
})
export class MapComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @Input() place: Partial<Place> | null = null;
  @Output() placeChange = new EventEmitter<Partial<Place>>();
  @Input() editable = false;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private defaultCenter: [number, number] = [48.8566, 2.3522];
  private defaultZoom = 13;
  private markerZoom = 16;
  private isMapInitialized = false; 
  private pendingMarker: { lat: number; lng: number } | null = null; 

  private defaultIcon = L.icon({
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['place'] &&
      this.place &&
      this.place.latitude &&
      this.place.longitude
    ) {
      if (this.isMapInitialized) {
        this.centerMap(this.place.latitude, this.place.longitude);
        this.addMarker(this.place.latitude, this.place.longitude);
      } else {
        this.pendingMarker = {
          lat: this.place.latitude,
          lng: this.place.longitude,
        };
      }
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  initMap(): void {
    if (this.map) return;

    L.Marker.prototype.options.icon = this.defaultIcon;

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(this.defaultCenter, this.defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.isMapInitialized = true;

    if (this.pendingMarker) {
      this.centerMap(this.pendingMarker.lat, this.pendingMarker.lng);
      this.addMarker(this.pendingMarker.lat, this.pendingMarker.lng);
      this.pendingMarker = null; 
    }

    if (this.editable) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        this.addMarker(lat, lng);
        this.reverseGeocode(lat, lng);
      });
    }

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private centerMap(lat: number, lng: number): void {
    this.map?.setView([lat, lng], this.markerZoom);
  }

  private addMarker(lat: number, lng: number): void {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }



  private reverseGeocode(lat: number, lng: number): void {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'fr', 
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.address;
  
        const city = address.city || address.town || address.village || address.locality;
        const street = address.road || address.pedestrian || address.footway; 
        const houseNumber = address.house_number; 
        const placeName = data.name || data.display_name.split(',')[0]; 
  
        const excludedPlaceNames = ["Pachalik de Safi", "Other Generic Place"];
  
        let formattedAddress = '';
        if (placeName && !excludedPlaceNames.includes(placeName.trim())) {
          formattedAddress += placeName.trim() + ', '; 
        }
        if (street) formattedAddress += street.trim() + ' ';
        if (houseNumber) formattedAddress += houseNumber.trim() + ', ';
        if (city) formattedAddress += city.trim();
  
        formattedAddress = formattedAddress.replace(/,\s*$/, '');
  
        const updatedPlace: Partial<Place> = {
          address: formattedAddress.trim(),
          latitude: lat,
          longitude: lng,
        };
        this.placeChange.emit(updatedPlace);
      })
      .catch((error) => {
        console.error('Error during reverse geocoding:', error);
      });
  }

  findMyLocation(): void {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.centerMap(latitude, longitude);
        this.addMarker(latitude, longitude);
        if (this.editable) this.reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Erreur lors de la récupération de la position:', error);
        alert(
          "Impossible d'obtenir votre position. Vérifiez les autorisations."
        );
      }
    );
  }

  searchPlace(query: string): void {
    if (!query) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lng = parseFloat(firstResult.lon);

          this.centerMap(lat, lng);
          this.addMarker(lat, lng);
          this.reverseGeocode(lat, lng);
        } else {
          alert('Aucun résultat trouvé pour cette recherche.');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la recherche du lieu:', error);
        alert('Une erreur est survenue lors de la recherche.');
      });
  }
}