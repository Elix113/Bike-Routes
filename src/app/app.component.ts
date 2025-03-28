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
  public finishedLoading = false;

  constructor(private cs: CyclingService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const loadInterval = setInterval(() => {
      this.finishedLoading = this.cs.finishedLoading;
      if (this.finishedLoading)
        clearInterval(loadInterval);
    }, 500);
  }

  openMenu() {
    if (this.finishedLoading) {
      this.dialog.open(MenuComponent, {
        width: '400px',
        disableClose: false,
      });
    }
  }


}
