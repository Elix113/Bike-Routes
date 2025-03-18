import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CyclingService } from './shared/cycling-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, Validators, FormControl, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MapComponent } from './map/map.component';
import { BoundaryService } from './shared/boundary.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DetailComponent } from './detail/detail.component';
import { MarkerPopupComponent } from './marker-popup/marker-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ListComponent,
    DetailComponent,
    MarkerPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    FlexLayoutModule,
    FlexModule,
    HttpClientModule,
    MatTableModule,
    MatTabsModule
  ],
  providers: [CyclingService, BoundaryService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
