import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../shared/Item';

@Component({
  selector: 'br-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss']
})
export class MarkerPopupComponent implements OnInit{
  @Input() item!: Item;
  heightDifference!: number;

  ngOnInit(): void {
    if (!this.item.isLoop)
      this.heightDifference = Math.abs(this.item.startingPoint.Altitude - this.item.arrivalPoint.Altitude);
  }

}
