import { CyclingService } from './../shared/cycling-service';
import { Component } from '@angular/core';
import { Item } from '../shared/Item';

@Component({
  selector: 'br-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  item!: Item;
  items: Item[] = [];
  displayedColumns: string[] = ['key', 'value'];
  displayData:{ key: string; value: string; }[] = [];

  constructor(private cyclingService: CyclingService){}

  async ngOnInit() {
    await this.cyclingService.getItems().then((items) => {
      this.items = items
    });
    console.log(this.items)
    this.item = this.items[0];
    this.displayData = this.transformItemToTableData(this.item)
  }


  transformItemToTableData(item: Item): { key: string; value: string }[] {
    const result: { key: string; value: string }[] = [];

    // Mapping of technical keys to user-friendly labels
    const keyMapping: Record<string, string> = {
      'firstImport': 'Erstes Importdatum',
      'lastUpdate': 'Letzte Aktualisierung',
      'detail.Title': 'Titel',
      'detail.Header': 'Überschrift',
      'detail.BaseText': 'Grundtext',
      'detail.Language': 'Sprache',
      'detail.MetaDesc': 'Meta-Beschreibung',
      'detail.MetaTitle': 'Meta-Titel',
      'detail.AuthorTip': 'Autorentipp',
      'detail.IntroText': 'Einleitungstext',
      'detail.SubHeader': 'Unterüberschrift',
      'detail.SafetyInfo': 'Sicherheitsinformationen',
      'detail.ParkingInfo': 'Parkinformationen',
      'detail.GetThereText': 'Anfahrtsbeschreibung',
      'detail.EquipmentInfo': 'Ausrüstungsinformationen',
      'detail.AdditionalText': 'Zusätzliche Informationen',
      'detail.PublicTransportationInfo': 'Öffentliche Verkehrsmittel',
      'position.Altitude': 'Höhe',
      'position.Latitude': 'Breitengrad',
      'position.Longitude': 'Längengrad',
      'startingPoint.Altitude': 'Startpunkt-Höhe',
      'startingPoint.Latitude': 'Startpunkt-Breitengrad',
      'startingPoint.Longitude': 'Startpunkt-Längengrad',
      'arrivalPoint.Altitude': 'Zielpunkt-Höhe',
      'arrivalPoint.Latitude': 'Zielpunkt-Breitengrad',
      'arrivalPoint.Longitude': 'Zielpunkt-Längengrad',
      'other.Highlight': 'Highlight',
      'other.OdhActive': 'ODH Aktiv',
      'other.Shortname': 'Kurzname',
      'other.SmgActive': 'SMG Aktiv',
      'other.WayNumber': 'Wegnummer',
      'other.Difficulty': 'Schwierigkeitsgrad',
      'other.Exposition': 'Exposition',
      'other.Facilities': 'Ausstattung',
      'other.HasRentals': 'Verleih vorhanden',
      'other.IsPrepared': 'Vorbereitet',
    };

    // Keys to exclude from the output
    const excludedKeys = new Set([
      'id',
      'tags',
      'arrivalPoint.Gpstype',
      'position.Gpstype',
      'startingPoint.Gpstype',
      'position.AltitudeUnitofMeasure',
      'arrivalPoint.AltitudeUnitofMeasure',
      'startingPoint.AltitudeUnitofMeasure',
    ]);

    function extractValues(obj: any, prefix = '') {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;

        // Skip null, undefined, and excluded keys
        if (value === null || value === undefined || excludedKeys.has(fullKey)) {
          continue;
        }

        let formattedValue = String(value);

        // Convert boolean values to "Ja"/"Nein"
        if (typeof value === 'boolean') {
          formattedValue = value ? 'Ja' : 'Nein';
        }

        // Append height unit to altitude values
        if (key === 'Altitude') {
          let unitKey = `${prefix}.AltitudeUnitofMeasure`;
          let unit = obj.AltitudeUnitofMeasure || ''; // Get unit if available
          formattedValue += unit ? ` ${unit}` : ''; // Append unit if it exists
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          extractValues(value, fullKey); // Recursively extract nested objects
        } else {
          result.push({
            key: keyMapping[fullKey] || fullKey, // Use user-friendly label if available
            value: formattedValue,
          });
        }
      }
    }

    extractValues(item);
    return result;
  }




}
