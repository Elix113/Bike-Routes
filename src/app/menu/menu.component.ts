import { CyclingService } from '../shared/cycling-service';
import { Component, OnInit } from '@angular/core';
import { Language } from '../shared/Item';

@Component({
  selector: 'br-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{

  public volume: number = 10;
  public language!: Language;
  public languages: { code: string, name: string }[] = [
    {code: Language.DE, name: "Deutsch"},
    {code: Language.EN, name: "English"},
    {code: Language.IT, name: "Italiano"},
  ];

  constructor(private cs: CyclingService){}

  ngOnInit(): void {
    this.language = this.cs.language;
  }

  onLaguagechange(l: Language) {
    this.cs.changeLanguage(l);
    this.language = this.cs.language;
  }

  decreaseVolume() {
    const diff = this.volume * 0.01;
    if (this.volume + diff <= 0)
      this.volume = 0;
    else
      this.volume -= diff;
  }

  increaseVolume() {
    const diff = this.volume * 0.01;
    if (this.volume + diff >= 100)
      this.volume = 100;
    else
      this.volume += diff;
  }

}
