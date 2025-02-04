export interface Detail {
  Title: string;
  Header: string;
  BaseText: string;
  Keywords: any;
  Language: Language;
  MetaDesc: string;
  AuthorTip: string;
  IntroText: string;
  MetaTitle: string;
  SubHeader: string;
  SafetyInfo: string;
  ParkingInfo: string;
  GetThereText: string;
  EquipmentInfo: string;
  AdditionalText: string;
  PublicTransportationInfo: string
}

export interface GpsInfo {
  Gpstype: string;
  Altitude: number;
  Latitude: number;
  Longitude: number;
  AltitudeUnitofMeasure: string;
}

export interface Other {
  Highlight: string;
  OdhActive: boolean;
  Shortname: string;
  SmgActive: boolean;
  WayNumber: string;
  Difficulty: string;
  Exposition: string;
  Facilities: string;
  HasRentals: boolean;
  IsPrepared: string;
}

export enum Language {
  DE = "de",
  EN = "en",
  IT = "it",
  CS = "cs",
  FR = "fr",
  NL = "nl",
  PL = "pl",
  RU = "ru",
}

export class Item {
  constructor(
    public id: string,
    public firstImport: Date,
    public lastUpdate: Date,
    public detail: Detail,
    public position: GpsInfo,
    public startingPoint: GpsInfo,
    public arrivalPoint: GpsInfo,
    public other: Other) {}

    changeLanguage(detail: Detail) {
      this.detail = detail;
    }
}
