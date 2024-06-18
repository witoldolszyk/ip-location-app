import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit, OnChanges {
  @Input() latitude?: number;
  @Input() longitude?: number;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 12;

  ngOnInit(): void {
    this.updateCenter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latitude'] && !changes['latitude'].isFirstChange()) {
      this.latitude = changes['latitude'].currentValue;
    }
    if (changes['longitude'] && !changes['longitude'].isFirstChange()) {
      this.longitude = changes['longitude'].currentValue;
    }
    this.updateCenter();
  }

  updateCenter(): void {
    if (this.latitude !== undefined && this.longitude !== undefined) {
      this.center = {
        lat: this.latitude,
        lng: this.longitude
      };
    }
  }
}
