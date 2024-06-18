import { Component, Input } from '@angular/core';
import { GeoLocation } from 'src/app/models/geo-location.model';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.css']
})
export class LocationInfoComponent {
  @Input() location: GeoLocation | undefined;
}
