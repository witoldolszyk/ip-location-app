import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IpService } from './services/ip.service';
import { GeolocationService } from './services/geolocation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeoLocation } from './models/geo-location.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  userIp: string | undefined;
  userLocation: GeoLocation | undefined;
  searchLocation: GeoLocation | undefined;
  showSearchLocation: boolean = false;
  searchHistory: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private ipService: IpService,
    private geolocationService: GeolocationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserIP();
  }

  getUserIP(): void {
    this.ipService.getIp().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.userIp = data.ip;
        console.log('User IP:', this.userIp);
        this.getUserIPLocation();
      },
      error: (error) => {
        console.error('Error getting user IP:', error);
      }
    });
  }

  getUserIPLocation(): void {
    if (this.userIp) {
      this.geolocationService.getLocation(this.userIp).pipe(takeUntil(this.destroy$)).subscribe({
        next: (location) => {
          console.log('User location received:', location);
          this.userLocation = location;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error getting user IP location:', error);
        }
      });
    }
  }

  onLocationFound(location: GeoLocation): void {
    this.searchLocation = location;
    this.showSearchLocation = true;
  }

  onError(error: string): void {
    console.error('Search error:', error);
    this.showSearchLocation = false;
  }

  onSearchTermEntered(searchTerm: string): void {
    this.searchHistory.push(searchTerm);
    console.log('Search history updated:', this.searchHistory);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
