import { GeoJsonObject } from './../../../node_modules/@types/geojson/index.d';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BoundaryService {
  private readonly STBOUNDARY_URL = "https://gist.github.com/tyrasd/3bdce59f3492685db927.js";

  constructor(private http: HttpClient) {}

  public loadSTBoundary(): Promise<GeoJsonObject> {
    return lastValueFrom(this.http.get<GeoJsonObject>('/assets/data/map.geojson'));
  }
}
