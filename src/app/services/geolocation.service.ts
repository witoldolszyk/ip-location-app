import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GeoLocation } from '../models/geo-location.model';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private apiUrl = `http://api.ipstack.com`;

  constructor(private http: HttpClient) { }

  getLocation(query: string): Observable<GeoLocation> {
    if (this.isValidURL(query)) {
      return this.extractLocationFromURL(query).pipe(
        map(coords => ({
          ip: '',
          latitude: coords.lat,
          longitude: coords.lng,
          city: '',
          region_name: '',
          country_name: ''
        })),
        catchError((error) => {
          console.error('Invalid URL:', query);
          throw new Error('Invalid URL'); 
        })
      );
    } else {
      return this.http.get<GeoLocation>(`${this.apiUrl}/${query}`).pipe(
        catchError((error) => {
          console.error('Error fetching location from IPStack:', error);
          throw new Error('Error fetching location from IPStack'); 
        })
      );
    }
  }

  getUserIP(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json').pipe(
      catchError((error) => {
        console.error('Error fetching IP address:', error);
        return of({ ip: '0.0.0.0' });
      })
    );
  }

  private isValidURL(query: string): boolean {
    try {
      new URL(query);
      return true;
    } catch (_) {
      return false;
    }
  }

  private extractLocationFromURL(url: string): Observable<{ lat: number, lng: number }> {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    const match = pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return of({ lat, lng });
    } else {
      throw new Error('Invalid URL');
    }
  }
}
