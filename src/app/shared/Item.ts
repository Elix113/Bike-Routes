export interface Detail {
  Title:                    string;   //588
  Header:                   string;   //Keine Einträge
  BaseText:                 string;   //Keine Einträge
  Keywords:                 any;      //Keine Einträge
  Language:                 Language; //588
  MetaDesc:                 string;   //549
  AuthorTip:                string;   //Keine Einträge
  IntroText:                string;   //Keine Einträge
  MetaTitle:                string;   //549
  SubHeader:                string;   //Keine Einträge
  SafetyInfo:               string;   //Keine Einträge
  ParkingInfo:              string;   //Keine Einträge
  GetThereText:             string;   //Keine Einträge
  EquipmentInfo:            string;   //Keine Einträge
  AdditionalText:           string;   //Keine Einträge
  PublicTransportationInfo: string;   //Keine Einträge
}

export interface GpsInfo {        //576
  Gpstype:                string; //Keine Daten
  Altitude:               number;
  Latitude:               number;
  Longitude:              number;
  AltitudeUnitofMeasure:  string;
}

export interface Other {
  Highlight:  string;   //Keine Daten
  OdhActive:  boolean;  //589
  Shortname:  string;   //589
  SmgActive:  boolean;  //589
  WayNumber:  string;   //330
  Difficulty: string;   //Keine Daten
  Exposition: string;   //Keine Daten
  Facilities: string;   //Keine Daten
  HasRentals: boolean;  //589
  IsPrepared: string;   //Keine Daten
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

  public isLoop: boolean; //Wenn true, hat das item kein arrivalPoint

  constructor(
    public id: string,
    public firstImport: Date,
    public lastUpdate: Date,
    public tags: string[],
    public detail: Detail,
    public position: GpsInfo,
    public startingPoint: GpsInfo,
    public arrivalPoint: GpsInfo,
    public other: Other) {
      this.isLoop = startingPoint?.Gpstype == "startingandarrivalpoint";
    }
}
