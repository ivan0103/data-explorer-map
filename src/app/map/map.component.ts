import {  Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import * as h3 from 'h3-js';
import {PoiService} from "src/app/Services/poi.service";
import { PointOfInterest, RoadHazardType } from 'src/app/Services/models/poi';
import { resolutionLevel } from '../Services/models/mapModels';
import { SearchFunction } from '../Services/models/searchModels'
import { GoogleMapsModule } from '@angular/google-maps';
import { HomepageComponent } from '../homepage/homepage.component';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  map!: google.maps.Map;
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom = 12;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    backgroundColor: '#212121',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            },
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ],
    disableDefaultUI: true,
    maxZoom: 20,
    minZoom: 1,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180
      },
      strictBounds: true
    }
  };

  displayedHexagons: Map<string, google.maps.Polygon> = new Map<string, google.maps.Polygon>();
  @Input() poiPerHex: Map<string, PointOfInterest[]> = new Map<string, PointOfInterest[]>;
  @Output() showInfotainmentPanel: EventEmitter<[string,string]> = new EventEmitter<[string,string]>();

  searchedHazards : Set<RoadHazardType> = new Set<RoadHazardType>(Object.values(RoadHazardType));

  searchHexIds: Set<string> = new Set<string>();
  searchUserHexIds:Set<string> = new Set<string>();
  flag =false;
  hexagonIds: Set<string> = new Set<string>;
  constructor(private poiService: PoiService, private homepage: HomepageComponent) {}

  ngOnInit(): void {
    // Loads json files from file
    fetch('./assets/mock_data_explorer.json').then(async res => {
      this.poiService.processJson(await res.json())
      this.poiPerHex = this.poiService.getPoiMap();
      const getHex = this.poiPerHex?.keys();
      if (getHex != undefined){
        for (const h of getHex) {
          this.hexagonIds.add(h);
        }
      }
      else {
        this.hexagonIds = new Set();
      }
    });

  }


  ngAfterViewInit(): void {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.initializeMap();
        },
        () => {
          this.initializeMap();
        }
      );
    } else {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      ...this.mapOptions
    });
    // Initialize the map and create hexagons for the initial bounds
    google.maps.event.addListener(this.map, 'bounds_changed', () => this.visualizeMap());

  }

  visualizeMap(): void {
    {
      const bounds = this.map.getBounds();
      if (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const minLat = sw.lat();
        const maxLat = ne.lat();
        const minLng = sw.lng();
        const maxLng = ne.lng();

        const coords = [minLat, maxLat, minLng, maxLng];
        this.displayedHexagons.forEach((hexagon) => {
          hexagon.setMap(null);
        });
        this.displayedHexagons = new Map<string, google.maps.Polygon>();

        const hexInBounds = this.filterInBounds(this.hexagonIds, coords);
        this.displayHexagons(hexInBounds, this.poiPerHex)
      }
    }
  }

  filterInBounds(hexagons: Set<string>, bounds: number[]): Set<string> {
    const res = new Set<string>;
    for (const hex of hexagons){
      const coords = h3.cellToLatLng(hex);
      const hexLat = coords[0];
      const hexLng = coords[1];
      if (hexLat >= bounds[0] && hexLat <= bounds[1] && hexLng >= bounds[2] && hexLng <= bounds[3]){
        res.add(hex);
      }
    }
    return res;
  }

  // why is this here?????????
  polygonIds: string[] = [];

  clickedHexId = '';

  displayHexagons(hexagons: Set<string>, poisPerHex: Map<string, PointOfInterest[]>): void {
    console.log(this.zoom,hexagons)
    for (const hex of hexagons) {
      const poisInHex = this.poiService.getPoIsByHexId(hex).filter(x => this.searchedHazards.has(x.type))
      const hexagonCoords = h3.cellToBoundary(hex, true);
      if ((this.searchHexIds.has(hex) || this.searchUserHexIds.has(hex)) && poisInHex.length>0 ) {
        const hexagonPolygon = new google.maps.Polygon({
          paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
          strokeColor: '#FFFFFF',
          strokeOpacity: 1,
          strokeWeight: 4,
          fillColor: '#A8CDBB',
          fillOpacity: 0.6,
          zIndex: 2,
        });

        hexagonPolygon.addListener('click', (event: google.maps.MapMouseEvent) => {

          const polygonId = hex;
          console.log('Clicked polygon ID:', polygonId);
          this.homepage.handleSearchTriggered([SearchFunction.SearchByHex,  polygonId], true)
          this.flag=true;

        });

        hexagonPolygon.setMap(this.map);
        this.displayedHexagons.set(hex, hexagonPolygon);
        this.polygonIds.push(hex);
      } else {
        const pois: PointOfInterest[] | undefined = poisPerHex.get(hex);
        if (typeof pois !== 'undefined' && pois.length > 0) {
          if (pois.map((x) => x.type).filter((y) => this.searchedHazards.has(y)).length > 0) {
            const hexagonPolygon = new google.maps.Polygon({
              paths: hexagonCoords.map((coord) => ({ lat: coord[1], lng: coord[0] })),
              strokeColor: '#577D86',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#577D86',
              fillOpacity: 0.35,
              zIndex: 1,
            });


            hexagonPolygon.addListener('click', (event: google.maps.MapMouseEvent) => {

              const polygonId = hex;
              console.log('Clicked polygon ID:', polygonId);
              console.log('Pois:', this.poiPerHex.get(polygonId));
              this.homepage.handleSearchTriggered(["hex",  polygonId], true)
              this.flag=true;

            });

            hexagonPolygon.setMap(this.map);
            this.displayedHexagons.set(hex, hexagonPolygon);
            this.polygonIds.push(hex);
          }
        }
      }
    }
  }

  updateHazards(neededHazards: Set<RoadHazardType>) {
    this.searchedHazards = neededHazards;
  }

  search(searchTuple: [string,string]): void {
    this.clearSearch()
    switch (searchTuple[0]) {
      case SearchFunction.SearchByHex:
        this.findHexagon(searchTuple[1]);
        break;
      case SearchFunction.SearchByPoiId:
        this.findPoi(searchTuple[1]);
        break;
      case SearchFunction.SearchByUser:
        this.findUser(searchTuple[1]);
        break;
    }
    
  }

  findHexagon(hexId: string): void {
    try{
      const searchedHex = hexId.replace(/\s/g, "");
      const hexagonCoords = h3.cellToBoundary(searchedHex, true);
      const resolution = h3.getResolution(searchedHex);
      if(resolution == -1 ){ 
        throw new Error("Hexagon not found");
      }
      this.searchHexIds.clear();
      this.searchHexIds.add(searchedHex);

      const newLocation = new google.maps.LatLng(hexagonCoords[0][1], hexagonCoords[0][0]);
      this.map.panTo(newLocation);
      this.map.setZoom(10);
      this.triggerInfoPanel([SearchFunction.SearchByHex, hexId]); 

    } catch(error) {
      alert("Hexagon not found");    
    } 
  }

  findPoi(poiId: string): void {
    try{
      const searchedHex = this.poiService.getPoiArr()
                                       .filter(x => x.id === poiId.replace(/\s/g, ""))
                                       .map(x => x.hexId)[0];
      
      const hexagonCoords = h3.cellToBoundary(searchedHex, true);
      const resolution = h3.getResolution(searchedHex);
      if(resolution == -1 ){ 
        throw new Error("POI not found");
      }
      this.searchHexIds.clear();
      this.searchHexIds.add(searchedHex);

      const newLocation = new google.maps.LatLng(hexagonCoords[0][1], hexagonCoords[0][0]);
      this.map.panTo(newLocation);
      this.map.setZoom(8);       
      this.triggerInfoPanel([SearchFunction.SearchByPoiId, poiId]);                     
    } catch(error) {
        alert("Point of Interest not found");
    }      
  }

  

  findUser(userId: string): void {
    try{
      let maxLan = -Infinity;
      let minLan = Infinity;
      let maxLng = -Infinity;
      let minLng = Infinity;
      const searchedHexes = this.poiService.getPoiArr()
                                         .filter(x => x.userId === userId)
                                         .map(x => x.hexId);

      if(!(searchedHexes.length > 0)){ 
        throw new Error("User not found");
      }
      for(const hex of searchedHexes){

        this.searchUserHexIds.add(hex);
        const hexagonCoords = h3.cellToBoundary(hex, true);

        maxLan = Math.max(maxLan, hexagonCoords[0][0]); 
        minLan = Math.min(minLan, hexagonCoords[0][0]);
        maxLng = Math.max(maxLng, hexagonCoords[0][1]);
        minLng = Math.min(minLng, hexagonCoords[0][1]); 

      }
      const bottomLeft = new google.maps.LatLng(minLng, minLan);
      const topRight = new google.maps.LatLng(maxLng, maxLan);
      this.map.fitBounds(new google.maps.LatLngBounds(bottomLeft, topRight));
      this.searchUserHexIds = this.transformHexagonsToLevel(this.searchUserHexIds);
      this.visualizeMap();
      this.triggerInfoPanel([SearchFunction.SearchByUser, userId]); 
    } catch(error) {
      alert("User ID not found");
    }
  }


  transformHexagonsToLevel(searchUserHexIds: Set<string>): Set<string>{

    const returnHexes: Set<string> = new Set<string>();
    for ( const hexId of searchUserHexIds)  {
      const hexResolution = h3.getResolution(hexId);
      if(resolutionLevel < hexResolution){
        const parentHexId = h3.cellToParent(hexId, resolutionLevel);
        returnHexes.add(parentHexId);

      } else if(resolutionLevel > hexResolution) {
        const childrenHexIds = h3.cellToChildren(hexId, resolutionLevel);
        
        for(const child of childrenHexIds){
          searchUserHexIds.add(child);
        }
      } else{
        returnHexes.add(hexId)
      } 
    }
    return returnHexes;
  }

  triggerInfoPanel(infoTuple: [string,string]) { 
    this.showInfotainmentPanel.emit(infoTuple);
  }

  clearSearch(){
    this.searchHexIds.clear();
    this.searchUserHexIds.clear();
    this.visualizeMap();
  }

}

