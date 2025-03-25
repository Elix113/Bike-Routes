import { MatDialog } from '@angular/material/dialog';
import { Language, GpsInfo, Item } from './shared/Item';
import { CyclingService } from './shared/cycling-service';
import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'br-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'BikeRoutes';
  items!: Item[];

  constructor(private cs: CyclingService, private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openMenu() {
    this.dialog.open(MenuComponent, {
      width: '400px',
      disableClose: false,
    });
  }


}
