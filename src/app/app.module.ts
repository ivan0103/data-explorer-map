import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './map/map.component'
import { Routes, RouterModule } from '@angular/router';
import { InfotainmentPanelComponent } from './infotainment-panel/infotainment-panel.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './homepage/homepage.component';
import { HexagonInfotainmentPanelComponent } from './infotainment-panel/hexagon-infotainment-panel/hexagon-infotainment-panel.component';
import { UserInfotainmentPanelComponent } from './infotainment-panel/user-infotainment-panel/user-infotainment-panel.component';
import { PoiInfotainmentPanelComponent } from './infotainment-panel/poi-infotainment-panel/poi-infotainment-panel.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterCheckbox } from './filter/filter.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { RegionInfotainmentPanelComponent } from './infotainment-panel/region-infotainment-panel/region-infotainment-panel.component';



const routes: Routes = [
  { path: '', component: HomepageComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InfotainmentPanelComponent,
    TopBarComponent,
    HomepageComponent,
    HexagonInfotainmentPanelComponent,
    UserInfotainmentPanelComponent,
    PoiInfotainmentPanelComponent,
    FilterCheckbox,
    PieChartComponent,
    RegionInfotainmentPanelComponent
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
