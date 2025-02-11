import { CyclingService } from '../shared/cycling-service';
import { Item } from '../shared/Item';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'br-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{

  constructor(private cs: CyclingService){}

  ngOnInit(): void {
    this.cs.loadPage(1).then(r => console.log(r))
  }

}
