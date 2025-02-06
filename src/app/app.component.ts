import { Language, GpsInfo, Item } from './shared/Item';
import { CyclingService } from './shared/cycling-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'br-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'BikeRoutes';
  item!: Item;

  constructor(private cs: CyclingService) {}

  ngOnInit(): void {
    this.cs.loadAll().then(items => {
      this.item = items[0]
    });
  }

  onClick() {
    if (this.cs.getLanguage() === Language.DE)
      this.item = this.cs.changeLanguage(Language.IT)[0];
    else
      this.item = this.cs.changeLanguage(Language.DE)[0];

  }

}
