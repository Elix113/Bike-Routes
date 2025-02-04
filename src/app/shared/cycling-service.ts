import { Injectable } from "@angular/core";
import { Detail, GpsInfo, Item, Language, Other } from "./Item";

@Injectable()
export class CyclingService {

  private readonly URL = 'https://tourism.api.opendatahub.com/v1/ODHActivityPoi?tagfilter=cycling';
  private language: Language = Language.DE;
  public ITEMS: Item[] = [];

  constructor() {}

  public async getItems(): Promise<Item[]> {
    await this.loadJsonPage(1);
    return this.ITEMS;
  }

  public changeLanguage(language: Language): Item[] {
    this.language = language;
    this.ITEMS.forEach(item => item.changeLanguage(this.getDetail(item)));
    console.log(`Sprache zu ${this.language} geändert`);
    return this.ITEMS;
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

  private async loadJsonPage(page: number) {
    try {
        const response = await fetch(this.URL + `&pagenumber=${page}`);
        if (!response.ok)
          throw new Error(`HTTP-Fehler: ${response.status}`);
        const data = await response.json();
        this.addItems(data.Items);
        console.log(`Seite ${page} geladen: ${this.ITEMS.length} Einträge`);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
  }

  private async loadJsonAll() {
    let nextPage: string | null = this.URL + "&pagenumber=1";
    try {
        while (nextPage) {
            const response : Response = await fetch(nextPage);
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            const data = await response.json();
            this.addItems(data.Items);
            nextPage = data.NextPage;
        }
        console.log(`Alle Seiten geladen: ${this.ITEMS.length} Einträge`);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
  }

  private addItems(rawItems: any[]) {
    rawItems.forEach(item => {
      this.ITEMS.push(new Item(
        this.getId(item),
        this.getFirstImport(item),
        this.getLastUpdate(item),
        this.getDetail(item),
        this.getGPSPosition(item),
        this.getGPSStartingPoint(item),
        this.getGPSArrivalPoint(item),
        this.getOther(item)
      ));
    })
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

  private getTags(rawItem: any) {

  }
}
