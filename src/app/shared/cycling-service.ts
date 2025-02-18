import { Injectable } from "@angular/core";
import { Detail, GpsInfo, Item, Language, Other } from "./Item";

@Injectable()
export class CyclingService {

  private readonly URL = "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?tagfilter=cycling";
  private language: Language = Language.DE;
  private RAW_ITEMS: any[] = [];
  private ITEMS: [Item, boolean][] = []
  private finishedLoading: boolean = false;


  constructor() {}

  public getItems(reduce: boolean = true): Item[] {
    if (this.finishedLoading) {
      if (reduce) {
        const items = this.ITEMS.filter(([item, flag]) => flag).map(([item, flag]) => item);
        console.log(`${items.length} verwendbare Einträge`);
        return items;
      }
      else {
        console.log(`${this.ITEMS.length} Einträge`);
        return this.ITEMS.map(([item, flag]) => item);
      }
    }
    else {
      console.error("Items sind noch nicht geladen");
      return [];
    }
  }

  public changeLanguage(language: Language): Item[] {
    if (this.finishedLoading) {
      this.language = language;
      this.ITEMS.forEach((i, index) => {
        i[0].detail = this.getDetail(this.RAW_ITEMS[index])
    });
      console.log(`Sprache zu ${this.language} geändert`);
      return this.getItems();
    }
    else {
      console.error("Items sind noch nicht geladen");
      return [];
    }
  }

  public getLanguage(): Language {
    return this.language;
  }

  //Too many requests, des isch die Wild methode ober funkt net
  // async loadJsonPageForPage() {
  //   const totalPages = 59;
  //   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  //   const urls = pageNumbers.map((pageNumber) => `${this.URL}&pagenumber=${pageNumber}`);

  //   try {
  //     const promises = urls.map((url) =>
  //       fetch(url).then((response) => {
  //         if (!response.ok)
  //           throw new Error(`HTTP-Fehler: ${response.status}`);
  //         return response.json();
  //       })
  //     );

  //     const results = await Promise.all(promises);

  //     results.forEach((data) => {
  //       this.rawItems.push(...data.Items);
  //     });

  //     console.log(`Alle Seiten geladen: ${this.rawItems.length} Einträge`);
  //   } catch (error) {
  //     console.error("Fehler beim Abrufen der Daten:", error);
  //   }
  // }

  public load(page: number = 0, reduce: boolean = true): Promise<Item[]> {
      return page === 0 ? this.loadAll(reduce) : this.loadPage(page, reduce);
  }

  private async loadPage(page: number, reduce: boolean = true): Promise<Item[]> {
    this.RAW_ITEMS = [];
    this.ITEMS = [];
    this.finishedLoading = false;
    try {
      const response = await fetch(this.URL + `&pagenumber=${page}`);
      if (!response.ok)
        throw new Error(`HTTP-Fehler: ${response.status}`);
      const data = await response.json();
      this.RAW_ITEMS = data.Items ;
      this.addItems(data.Items);
      this.finishedLoading = true;
      console.log(`Seite ${page} geladen: ${this.ITEMS.length} Einträge`);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
    return this.getItems(reduce);
  }

  private async loadAll(reduce: boolean = true): Promise<Item[]> {
    this.RAW_ITEMS = [];
    this.ITEMS = [];
    this.finishedLoading = false;
    let nextPage: string | null = this.URL + "&pagenumber=1";
    try {
        while (nextPage) {
            const response : Response = await fetch(nextPage);
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            const data = await response.json();
            this.RAW_ITEMS.push(...data.Items)
            this.addItems(data.Items);
            nextPage = data.NextPage;
        }
        this.finishedLoading = true;
        console.log(`Alle Seiten geladen: ${this.ITEMS.length} Einträge`);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
    return this.getItems(reduce);
  }

  private addItems(rawItems: any[]) {
    rawItems.forEach(rawItem => {
      const item = new Item(
        this.getId(rawItem),
        this.getFirstImport(rawItem),
        this.getLastUpdate(rawItem),
        this.getTags(rawItem),
        this.getDetail(rawItem),
        this.getGPSPosition(rawItem),
        this.getGPSStartingPoint(rawItem),
        this.getGPSArrivalPoint(rawItem),
        this.getOther(rawItem),
      );
      this.ITEMS.push([item, this.isValid(item)]);
    })
  }

  /**
   * Validiert ein Item und gibt true zurück, wenn alle notwendigen Daten vorhanden sind.
   * - Falls die GPS-Typen nicht richtig geordnet sind, werde sie umgeordnet
   * - Falls Breiten- und Längengrad vertauscht sind, werden diese umgetauscht
  */
  private isValid(item: Item) {
    let valid = false;
    if (item.detail.Title && item.position && item.startingPoint && (item.arrivalPoint || item.isLoop)) {

      if (item.position.Gpstype === "startingpoint" ) {
        const arrivalPoint: GpsInfo = item.startingPoint;
        item.startingPoint = item.position;
        item.position = item.arrivalPoint
        item.arrivalPoint = arrivalPoint;
      }
      if (item.position.Latitude < 45 && item.position.Longitude > 13) {
        let lat: number = item.position.Longitude;
        item.position.Longitude = item.position.Latitude;
        item.position.Latitude = lat;
        lat = item.startingPoint.Longitude;
        item.startingPoint.Longitude = item.startingPoint.Latitude;
        item.startingPoint.Latitude = lat;
        if (item.arrivalPoint) {
          lat = item.arrivalPoint.Longitude;
          item.arrivalPoint.Longitude = item.arrivalPoint.Latitude;
          item.arrivalPoint.Latitude = lat;
        }
      }
      valid = true;
    }
    return valid;
  }

  private getId(rawItem: any): string {
    return rawItem.Id;
  }

  private getFirstImport(rawItem: any): Date {
    return new Date(rawItem.FirstImport);
  }

  private getLastUpdate(rawItem: any): Date {
    return new Date(rawItem._Meta.LastUpdate);
  }

  private getDetail(rawItem: any): Detail {
    return rawItem.Detail[this.language];
  }

  private getIsOpen(rawItem: any): boolean {
    return rawItem.IsOpen;
  }

  private getGPSStartingPoint(rawItem: any): GpsInfo {
    return rawItem.GpsInfo[0];
  }

  private getGPSPosition(rawItem: any): GpsInfo {
    return rawItem.GpsInfo[1];
  }

  private getGPSArrivalPoint(rawItem: any): GpsInfo {
    return rawItem.GpsInfo[2];
  }

  private getOther(rawItem: any): Other {
    return {
      Highlight: rawItem.Highlight,
      OdhActive: rawItem.OdhActive,
      Shortname: rawItem.Shortname,
      SmgActive: rawItem.SmgActive,
      WayNumber: rawItem.WayNumber,
      Difficulty: rawItem.Difficulty,
      Exposition: rawItem.Exposition,
      Facilities: rawItem.Facilities,
      HasRentals: rawItem.HasRentals,
      IsPrepared: rawItem.IsPrepared,
    }
  }

  private getTags(rawItem: any): string[] {
    const tags: string[] = [];
    rawItem.Tags.forEach((i: any) => {
      if (!tags.includes(i.Name))
        tags.push(i.Name);
    });
    rawItem.LTSTags.forEach((i: any) => {
      if (!tags.includes(i.TagName.en))
        tags.push(i.TagName.en);
    });
    rawItem.ODHTags.forEach((i: any) => {
      if (!tags.includes(i.Id))
        tags.push(i.Id);
    });
    rawItem.SmgTags.forEach((i: any) => {
      if (!tags.includes(i))
        tags.push(i);
    });
    return tags;
  }
}
