import { GpsInfo } from './../shared/Item';
import { Marker } from './../../../node_modules/@types/leaflet/index.d';
import { GeoJsonObject } from './../../../node_modules/@types/geojson/index.d';
import * as L from 'leaflet';
import { CyclingService } from '../shared/cycling-service';
import { Item } from '../shared/Item';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BoundaryService } from '../shared/boundary.service';

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

  constructor(private cs: CyclingService, private bs: BoundaryService) {}

  ngOnInit(): void {
    this.cs.loadPage(1).then((items) => {
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
      const marker = L.marker([item.position.Latitude, item.position.Longitude])
        .bindPopup(this.createPopupContent(item));
        marker.on("click", () => this.handleMarkerClick(marker, item));
        markers.push(marker);
    }
    const lg: L.LayerGroup = L.layerGroup(markers).addTo(this.map);
    this.layerControl.addOverlay(lg, "Pins").addTo(this.map)
  }

  private createPopupContent(item: Item): string {
    return `
      <div style="
        font-family: Arial, sans-serif;
        text-align: left;
        padding: 10px;
        width: 250px;
        border-radius: 8px;
        background-color: #f8f9fa;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      ">
        <h3 style="margin: 0 0 5px; color: #007bff;">${item.detail.Title}</h3>
        <p style="margin: 5px 0; font-size: 14px; color: #333;">
          <strong>Beschreibung:</strong> ${item.detail.MetaDesc}
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Koordinaten:</strong> ${item.position.Latitude}, ${item.position.Longitude}
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Starthöhenmeter:</strong> ${item.startingPoint.Altitude} m
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Endhöhenmeter:</strong> ${item.arrivalPoint.Altitude} m
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Höhenunterschied:</strong> ${item.startingPoint.Altitude - item.arrivalPoint.Altitude} m
        </p>
      </div>
    `;
  }

  private handleMarkerClick(marker: L.Marker, item: Item) {
    this.map.flyTo(marker.getLatLng(), 15);
    const line = this.createPolyline(item)
    if (line) {
      line.addTo(this.map);
      marker.once("popupclose", () => line.remove());
    }
  }

  private addRoutes() {
    const lines: L.Polyline[] = []
    for (const item of this.items) {
      const line = this.createPolyline(item);
      if (line)
        lines.push(line);
    }
    const lg: L.LayerGroup = L.layerGroup(lines);
    this.layerControl.addOverlay(lg, "Strecken").addTo(this.map)
  }

  private createPolyline(item: Item): L.Polyline | null{
    if (item.arrivalPoint && item.startingPoint) {
      return L.polyline([
        [item.startingPoint.Latitude, item.startingPoint.Longitude],
        [item.arrivalPoint.Latitude, item.arrivalPoint.Longitude]
      ]);
    }
    return null;
  }
}
