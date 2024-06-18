import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { GeolocationService } from '../../services/geolocation.service';
import { GeoLocation } from 'src/app/models/geo-location.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnDestroy {
  @Output() locationFound = new EventEmitter<GeoLocation>();
  @Output() errorOccurred = new EventEmitter<string>();
  @Output() searchTermEntered = new EventEmitter<string>();
  ipOrUrl: string = '';
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(private geolocationService: GeolocationService) { }

  

  search(): void {
    this.errorMessage = '';
    this.searchTermEntered.emit(this.ipOrUrl);
    this.geolocationService.getLocation(this.ipOrUrl).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: GeoLocation) => {
        if (data && data.latitude && data.longitude) {
          this.locationFound.emit(data);
          console.log('Search successful:', data);
        } else {
          this.handleError('Invalid response data');
        }
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    console.log('Search failed:', error);
    if (typeof error === 'string') {
      this.errorMessage = error;
    } else if (error.error && error.error.info) {
      this.errorMessage = error.error.info;
    } else {
      this.errorMessage = 'Invalid URL or IP address';
    }
    this.errorOccurred.emit(this.errorMessage);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
