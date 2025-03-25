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
    this.cs.getItems().then((items) => {
      this.items = items;
    });
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
