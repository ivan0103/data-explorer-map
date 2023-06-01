import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { InfotainmentPanelComponent } from '../infotainment-panel/infotainment-panel.component';
import { FilterCheckbox } from '../filter/filter.component';
import { RoadHazardType } from '../Services/models/poi';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(TopBarComponent) topBarComponent!: TopBarComponent;
  @ViewChild(InfotainmentPanelComponent) infotainmentPanelComponent!: InfotainmentPanelComponent;
  @ViewChild(FilterCheckbox) filterCheckbox!: FilterCheckbox;
  title = 'Angular';
  async handleSearchTriggered(hexagonId: string){
    const hexId = hexagonId.replace(/\s/g, "");
    this.mapComponent.findHexagon(hexId)

    this.infotainmentPanelComponent.searchedHex = hexId
    this.infotainmentPanelComponent.chooseInfPanel = "hex"
    this.infotainmentPanelComponent.showInfotainmentPanel = true;
  }
  handleClearSearchTriggered(){
    this.mapComponent.clearSearch();
    this.infotainmentPanelComponent.chooseInfPanel = ""
    this.infotainmentPanelComponent.showInfotainmentPanel = false;
    this.topBarComponent.searchText = "" 
  }

  handleHazardCheckboxChange(status: [hazType: string, isChecked: boolean]) {
    try {
      let currentHaz : Set<RoadHazardType> = this.mapComponent.searchedHazards;
      if (status[1]) {
        currentHaz.add(status[0] as RoadHazardType);
      } else {
        currentHaz.delete(status[0] as RoadHazardType);
      }
      console.log(currentHaz);
      this.mapComponent.updateHazards(currentHaz);
      this.mapComponent.visualizeMap();
    } catch (error) {
      console.log(error);
    }
  }
}
