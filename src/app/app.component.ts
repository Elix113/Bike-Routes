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
  items!: Item[];

  constructor(private cs: CyclingService) {}

  ngOnInit(): void {
    this.cs.getItems().then(items => {
      this.items = items;
    });
  }
}
