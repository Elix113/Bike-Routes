import { Component, OnInit } from '@angular/core';
import { CyclingService } from '../shared/cycling-service';
import { Item } from '../shared/Item';
import { Router } from '@angular/router';

@Component({
  selector: 'br-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public items!: Item[];
  displayedColumns: string[] = ['title', 'coordinates', 'startingAltitude', 'arrivalAltitude', 'heightDifference', 'action'];
  public cardView = true;

  constructor(private cs: CyclingService, private router: Router) {}

  ngOnInit(): void {
    if (this.cs.finishedLoading)
      this.cs.getItems().then(items => this.items = items);
    else {
      const loadInterval = setInterval(() => {
        this.cs.getItems().then(items => {
          this.items = items;
          if (this.cs.finishedLoading)
            clearInterval(loadInterval);
        });
      }, 500);
    }
  }

  getHeightDifference(item: Item): number | null {
    return !item.isLoop ? Math.abs(item.startingPoint.Altitude - item.arrivalPoint.Altitude) : null;
  }

  showOnMap(item: Item) {
    this.router.navigate(['map', item.id]);
  }

  toggleView(): void {
    this.cardView = !this.cardView;
  }

  openDetail(item: Item) {
    this.router.navigate([item.id]);
  }
}
