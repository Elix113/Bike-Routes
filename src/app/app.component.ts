import { CyclingService } from './shared/cycling-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'br-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'BikeRoutes';

  constructor(private cs: CyclingService) {}

  ngOnInit(): void {
    this.cs.getItems().then(items => {
      console.log(items[0])
    });
  }

}
