import {
  primaryColour,
  defaultColour,
  barnColour,
  ceremonialSiteColour,
  farmBoundColour,
  fieldColour,
  greenhouseColour,
  groundwaterColour,
  naturalAreaColour,
  residenceColour,
  creekColour,
  fenceColour,
} from './styles.module.scss';

import { ENVIRONMENT } from './constants'

// Area Drawing
const areaStyles = {
  'barn': {
    colour: barnColour,
    dashScale: 2,
    dashLength: '14px',
  },
  'ceremonial': {
    colour: ceremonialSiteColour,
    dashScale: 1.5,
    dashLength: '8px',
  },
  'farmBound': {
    colour: farmBoundColour,
    dashScale: 1,
    dashLength: '1px',
  },
  'field': {
    colour: fieldColour,
    dashScale: 1,
    dashLength: '6px',
  },
  'greenhouse': {
    colour: greenhouseColour,
    dashScale: 1,
    dashLength: '8px',
  },
  'groundwater': {
    colour: groundwaterColour,
    dashScale: 0.7,
    dashLength: '6px',
  },
  'natural': {
    colour: naturalAreaColour,
    dashScale: 0.7,
    dashLength: '12px',
  },
  'residence': {
    colour: residenceColour,
    dashScale: 0,
    dashLength: '12px',
  },
}
const drawArea = (map, maps, mapBounds, areaType, area) => {
  const { grid_points: points, field_name } = area;
  const { colour, dashScale, dashLength } = areaStyles[areaType];
  points.forEach((point) => {
    mapBounds.extend(point);
  });

  const polygon = new maps.Polygon({
    paths: points,
    strokeColor: defaultColour,
    // strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: colour,
    fillOpacity: 0.5,
  });
  polygon.setMap(map);

  maps.event.addListener(polygon, "mouseover", function() {
    this.setOptions({ fillOpacity: 0.8 });
  });
  maps.event.addListener(polygon, "mouseout", function() {
    this.setOptions({ fillOpacity: 0.5 });
  });
  maps.event.addListener(polygon, "click", function() {
    console.log("clicked area");
  });

  // draw dotted outline
  let borderPoints = points.map((point) => ({
    ...point    
  }));
  borderPoints.push(points[0]);

  const lineSymbol = {
    path: "M 0,0 0,1",
    strokeColor: colour,
    strokeOpacity: 1,
    strokeWeight: 2,
    scale: dashScale,
  };
  const polyline = new maps.Polyline({
    path: borderPoints,
    strokeOpacity: 0,
    icons: [
      {
        icon: lineSymbol,
        offset: "0",
        repeat: dashLength,
      },
    ],
  });
  polyline.setMap(map);

  // add area name label
  maps.Polygon.prototype.getPolygonBounds = function () {
    var bounds = new maps.LatLngBounds();
    this.getPath().forEach(function (element, index) {
      bounds.extend(element);
    });
    return bounds;
  };
  const fieldMarker = new maps.Marker({
    position: polygon.getPolygonBounds().getCenter(),
    map: map,
    icon: lineSymbol,
    label: { text: field_name, color: 'white' },
  });
  fieldMarker.setMap(map);
}

// Line Drawing
const lineStyles = {
  'creek': {
    colour: creekColour,
    dashScale: 0.7,
    dashLength: '6px',
  },
  'fence': {
    colour: fenceColour,
    dashScale: 1,
    dashLength: '6px',
  },
}
const drawLine = (map, maps, mapBounds, lineType, line) => {
  const { grid_points: points, name } = line;
  const { colour, dashScale, dashLength } = lineStyles[lineType];
  points.forEach((point) => {
    mapBounds.extend(point);
  });

  var polyline = new maps.Polyline({
    path: points,
    strokeColor: defaultColour,
    strokeOpacity: 1.0,
    strokeWeight: 2,
    // fillColor: primaryColour,
    // fillOpacity: 0.35,
  });
  polyline.setMap(map);

  // draw dotted outline
  const lineSymbol = {
    path: "M 0,0 0,1",
    strokeColor: colour,
    strokeOpacity: 1,
    strokeWeight: 2,
    scale: dashScale,
  };
  const dottedPolyline = new maps.Polyline({
    path: points,
    strokeOpacity: 0,
    icons: [
      {
        icon: lineSymbol,
        offset: "0",
        repeat: dashLength,
      },
    ],
  });
  dottedPolyline.setMap(map);

  maps.event.addListener(polyline, "mouseover", function() {
    this.setOptions({ strokeColor: colour });
  });
  maps.event.addListener(polyline, "mouseout", function() {
    this.setOptions({ strokeColor: defaultColour });
  });
  maps.event.addListener(polyline, "click", function() {
    console.log("clicked line");
  });
}

// Point Drawing
// const assetURL = process.env
const assetUrlDict = {
  development: 'http://localhost:3000',
  integration: 'http://beta.litefarm.org',
  production: 'http://app.litefarm.org'
}
const assetURL = assetUrlDict[ENVIRONMENT];
const icons = {
  'gate': `${assetURL}/gate.png`,
  'waterValve': `${assetURL}/water-valve.png`,
}
const hoverIcons = {
  'gate': `${assetURL}/gate-hover.png`,
  'waterValve': `${assetURL}/water-valve-hover.png`,
}
const drawPoint = (map, maps, mapBounds, pointType, point) => {
  console.log(process.env);
  const { grid_point, name } = point;
  mapBounds.extend(grid_point);

  var marker = new maps.Marker({
    position: grid_point,
    icon: icons[pointType],
  });
  marker.setMap(map);

  maps.event.addListener(marker, "mouseover", function() {
    this.setOptions({ icon: hoverIcons[pointType] });
  });
  maps.event.addListener(marker, "mouseout", function() {
    this.setOptions({ icon: icons[pointType] });
  });
}

export {
  drawArea,
  drawLine,
  drawPoint,
}