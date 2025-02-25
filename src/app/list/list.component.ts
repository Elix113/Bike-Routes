import { Component, OnInit } from '@angular/core';
import { CyclingService } from '../shared/cycling-service';
import { Item } from '../shared/Item';

@Component({
  selector: 'br-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public items!: Item[];
  constructor(private cs: CyclingService) {}

  ngOnInit(): void {
    this.cs.loadPage(1).then((items) => {
      this.items = items;
    });
  }

}
