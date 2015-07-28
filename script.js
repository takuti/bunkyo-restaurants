function generatePopupContent(properties) {
  content = "";
  for (key in properties) {
    content += "<b>" + key + "</b> " + properties[key] + "<br />";
  }
  return content;
}

// set leaftlet map
var map = L.map('map').setView([35.72, 139.75], 14);
L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'takuti.5bebb9b7',
    accessToken: 'pk.eyJ1IjoidGFrdXRpIiwiYSI6ImFmM2UxMmFjMGI5MDA2NjIzYmZlODJkYzBkYThkZjAxIn0.VuS-dUlX3RIldJBJstFLMw'
}).addTo(map);

httpObj = new XMLHttpRequest();
httpObj.open('get', './bunkyo100.geojson', true);
httpObj.onload = function(){
  // load points from GeoJSON
  var points = JSON.parse(this.responseText)['features'];

  // add markers for each point
  var categories = {}
  for (var i = 0; i < points.length; i++) {
    var marker = L.marker(points[i]['geometry']['coordinates'].reverse()).addTo(map);
    marker.bindPopup(generatePopupContent(points[i]['properties']));

    var cat = points[i]['properties']['category'];
    if (cat in categories) {
      categories[cat].push(marker);
    } else {
      categories[cat] = [marker];
    }
  }

  // convert marker group (array) -> layer group
  /*
  for (cat in categories) {
    categories[cat] = L.layerGroup(categories[cat]);
    console.log(cat);
  }
  L.control.layers(categories).addTo(map);
  */
}
httpObj.send(null);
