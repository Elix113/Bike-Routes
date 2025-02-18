import { GpsInfo } from './../shared/Item';
import { GeoJsonObject } from './../../../node_modules/@types/geojson/index.d';
import * as L from 'leaflet';
import { CyclingService } from '../shared/cycling-service';
import { Item } from '../shared/Item';
import { AfterViewInit, Component, OnInit, ViewContainerRef } from '@angular/core';
import { BoundaryService } from '../shared/boundary.service';
import { MarkerPopupComponent } from '../marker-popup/marker-popup.component';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'br-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  private readonly CENTER: number[] = [46.49925004294629, 11.332801353356082];
  private map!: L.Map;
  private items!: Item[];
  private mapReady!: Promise<void>;
  private resolveMapReady!: () => void;
  private layerControl!: L.Control.Layers;

  private boundary!: GeoJsonObject;

  constructor(private cs: CyclingService, private bs: BoundaryService, private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.cs.load(3).then((items) => {
      this.items = items;
      this.mapReady.then(() => {
        this.addMarkers();
        this.addRoutes();
      });
    });
    this.bs.loadSTBoundary().then(boundary => {
      this.boundary = boundary
      this.mapReady.then(() => {
        this.addBoundary();
      });
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([this.CENTER[0], this.CENTER[1]], 10);
    this.addLayers();

    this.mapReady = new Promise((resolve) => (this.resolveMapReady = resolve));
    this.resolveMapReady();
  }


  private addLayers() {
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors',
    });

    const outdoor = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: 'Maps © Thunderforest, Data © OpenStreetMap contributors'
    });

    const cycle = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: 'Maps © Thunderforest, Data © OpenStreetMap contributors'
    }).addTo(this.map);

    this.layerControl = L.control.layers({
      'OpenStreetMap': osm,
      'Wanderkarte': outdoor,
      'Fahrradkarte': cycle,
    }).addTo(this.map);
  }

  private addBoundary() {
    const boundary = L.geoJSON(this.boundary, {
      style: (feature) => ({
        weight: 3,
        opacity: 1,
        color: '#e25a5a',
      })
    });
    this.layerControl.addOverlay(boundary, "Grenze").addTo(this.map)
  }

  private addMarkers() {
    const markers: L.Marker[] = []
    for (const item of this.items) {
      markers.push(this.createMarker(item));
    }
    const lg: L.LayerGroup = L.layerGroup(markers).addTo(this.map);
    this.layerControl.addOverlay(lg, "Pins").addTo(this.map)
  }

  private createPopupContent(item: Item): HTMLElement {
    const componentRef = this.viewContainerRef.createComponent(MarkerPopupComponent);
    componentRef.instance.item = item;

    const div = document.createElement('div');
    div.appendChild(componentRef.location.nativeElement);

    return div;
  }

  private handleMarkerClick(marker: L.Marker, item: Item) {
    this.map.flyTo(marker.getLatLng(), 13).once("moveend", () => {
      const line = this.createRoutePolyline(item, true)
      if (line) {
        line.addTo(this.map);
        marker.once("popupclose", () => line.remove());
      }
      const arrivalPoint = this.createArrivalCircle(item).addTo(this.map);
      marker.once("popupclose", () => arrivalPoint.remove());
    });
  }

  private addRoutes() {
    const lines: L.Polyline[] = []
    for (const item of this.items) {
      const line = this.createRoutePolyline(item);
      if (line)
        lines.push(line);
    }
    const lg: L.LayerGroup = L.layerGroup(lines);
    this.layerControl.addOverlay(lg, "Strecken").addTo(this.map)
  }

  private createMarker(item: Item): L.Marker {
      const marker = L.marker([item.position.Latitude, item.position.Longitude]);
      marker.bindPopup(this.createPopupContent(item));
      marker.on("click", () => this.handleMarkerClick(marker, item));
    return marker;
  }

  private createRoutePolyline(item: Item, dashed: boolean = false): L.Polyline | null{
    if (!item.isLoop) {
      const line = L.polyline([
        [item.startingPoint.Latitude, item.startingPoint.Longitude],
        [item.arrivalPoint.Latitude, item.arrivalPoint.Longitude]
      ]);
      if (dashed)
        line.setStyle({dashArray: "5, 20"});
      return line;
    }
    return null;
  }

  private createArrivalCircle(item: Item): L.CircleMarker {
    const pos: GpsInfo = item.isLoop ? item.startingPoint : item.arrivalPoint;
    return L.circleMarker([pos.Latitude, pos.Longitude], {
      radius: 5,
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.8
    });
  }

}
