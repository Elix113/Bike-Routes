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
  public filteredItems!: Item[];
  public searchTerm: string = "";
  displayedColumns: string[] = ['title', 'coordinates', 'startingAltitude', 'arrivalAltitude', 'heightDifference', 'action'];
  public cardView = true;

  constructor(private cs: CyclingService, private router: Router) {}

  ngOnInit(): void {
    if (this.cs.finishedLoading)
      this.cs.getItems().then(items => {
        this.items = items;
        this.filteredItems = items;
        this.applyFilter(this.searchTerm);
    	});
      else {
        const loadInterval = setInterval(() => {
          this.cs.getItems().then(items => {
            this.items = items;
            this.applyFilter(this.searchTerm);
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

  applyFilter(term: string) {
    this.searchTerm = term.toLowerCase();
    this.filteredItems = this.items.filter(item => {
      return item.detail.Title.toLowerCase().includes(this.searchTerm)
      || (item.detail.MetaDesc && item.detail.MetaDesc.toLowerCase().includes(this.searchTerm));
    });
  }
}
