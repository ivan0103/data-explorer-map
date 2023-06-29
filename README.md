# Data Explorer Map

## Description

Data Explorer Map is Web Tool for visual representation of data that was submitted by vehicles driving on the road across the globe.
Second Year Software Group Project in TUD CSE Bachelor Degree, where we develop a product for a real company as an internship, provided by the university.

## Technologies
- Angular: TypeScript, HTML & CSS
- Google Maps API: deactivated
- Uber H3-JS
- OpenWeatherAPI
- Chart.js
- Karma & jasmine

## My Role
### Implementation
- Map and Hexagon visualization
- Infotainment panel and its children structure
- Hexagon and Region infotainment components
- Search by Region
- Back and Forward buttons for infotainment panels
- Homepage Component
- Pipeline
- Documentation
- Testing
### Report
- Requirment Elicitation section
- Appendix 1: MoSCoW
- Table of Contents
- Introduction
### Project
- Communication with university and client
- Creating gitlab issues, with labels and weights
- Assigning issues to team members
- Planning work distribution and schedule

## Project Plan
Report detailing the process of developing the project.

## Installation
- Make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from the official Node.js website: https://nodejs.org 
- Open a command-line interface and navigate to the directory where you have the project downloaded.
- Install Angular CLI: 
```
npm install -g @angular/cli
```
## Usage
- Navigate to the project directory: 
```
cd my-angular-project
```
- Install project dependencies: 
```
npm install
```
- Run the Angular development server: 
```
ng serve
```
- Access the application: After the development server has started, open a web browser and navigate to http://localhost:4200.

## Testing
- Run tests:
```
ng test
```
- Run pipeline for checkstyle:
```
npx eslint --ext .ts . --fix
```

## Usage
- Each displayed Hexagon represents a reported hazard or a point of interest inside the region the hexagon is on.
- Hovering over a hexagon will display a pop-up showing all the unique types of hazards.
- Clicking a hexagon will show an infotainment panel with further information for the hexagon.
- Searching for hexagon will show an infotainment panel with further information for the hexagon.
- Searching for a hazard will show an infotainment panel with further information for the hazard.
- Searching for a user will show an infotainment panel with further information for the user.
- Searching for a region will show an infotainment panel with further information for the region.
- Hexagons can be fittered so that only hexagon with certain point of interests will be visualized.
- Users can navigate between searches and infotainment panels throught the back and forward buttons inside the infotainment panels.
