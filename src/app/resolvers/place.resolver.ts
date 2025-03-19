import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaceService, Place } from '../services/place.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceResolver implements Resolve<Place[]> {
  constructor(private placeService: PlaceService) {}

  resolve(): Observable<Place[]> {
    return this.placeService.getAllPlaces(); 
  }
}
