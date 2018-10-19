
//*****************************************************************************
// rinksReadings is the global array that will hold all information about rinks and their readings
// rinkReadings[username][0] is an array of the reading dates
// rinkReadings[username][1] is an array of the reading data (0 or 1)
// rinkReadings[username][2] is an array of the reading conditions (0 to 4)
// rinkReadings[username][3] is the rink coordinates [lat, lng]
//*****************************************************************************
var rinksReadings = {};

// links to the two Survey123 hosted feature services
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_47bbdd102ad44affb7a5835f9fb4085e/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_c3d35e73bb6e47fbb0b6d17f687a954e/FeatureServer/0';

var map;
var rinksLayer = new L.LayerGroup();
var skateableLayer = new L.LayerGroup();
var notskateableLayer = new L.LayerGroup();

var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
var days_ago = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

// set the icons
var icon_notskateable = L.icon({
    iconUrl: 'assets/img/icon_rink_notskateable.png',
    iconSize: [50,50]
});
var icon_skateable = L.icon({
    iconUrl: 'assets/img/icon_rink_skateable.png',
    iconSize: [50,50]
});
var icon_rink_marker = L.icon({
    iconUrl: 'assets/img/icon_rink_marker.png',
    iconSize: [50,50]
});
var icon_owner = L.icon({
    iconUrl: 'assets/img/icon_rink_owner.png',
    iconSize: [50,50]
}); 

var rinks_layer = L.esri.featureLayer({
  url: rinks_url,
  onEachFeature: function(feature, layer){
    var coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    var rink_name_data = feature.properties.rink_name;

    // create temporary arrays for each reading for this particular user
    var reading_date = [];
    var reading_skateable = [];
    var reading_conditions = [];

    // Query getting all readings for current user sorted by most recent date
    L.esri.query({
      url: readings_url,
    }).where("Creator='" + feature.properties.Creator + "'").orderBy("CreationDate", "DESC").run(function(error, featureCollection){
      
      if(featureCollection){
        // loop around each reading for this user
        $.each(featureCollection.features, function(i, v) { 

          // Put all of the readings data into three different arrays later to go into rinksReadings global array
          reading_date.push(new Date(v.properties.CreationDate)); // [0]
          reading_skateable.push(v.properties.reading_skateable); // [1]
          reading_conditions.push(v.properties.reading_conditions); // [2]

        }); // END $.each
      } // END if(featureCollection)

      // This is just setting human language for the information in the pop up box below
      last_reading_reading_date = reading_date[0];
      if(reading_skateable[0]==0){
        last_reading_skateable = 'Not Skateable';
      }else{
        last_reading_skateable = 'Skateable';
      }

      // Check to see if it is the user's rink - if so, use special marker icon and possibly specialized pop up box info
      if(feature.properties.Creator == username){ // This is the user's rink
        var popupContent = L.Util.template(
            'Creator: {Creator} <br />' + 
            'Rink: {rink_name} <br />' + 
            'Description: {rink_desc} <br />' + 
            'Last update: ' + last_reading_skateable + ' on ' + last_reading_reading_date + ' <br />' + 
            '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />'
        , feature.properties);
        layer.bindPopup(popupContent);
        layer.setIcon(icon_owner);
        var zoom = 10;
        map.setView(coords, zoom);
        L.marker(coords).bindPopup(popupContent).addTo(rinksLayer);
      } else {
        var popupContent = L.Util.template(
            'Creator: {Creator} <br />' + 
            'Rink: {rink_name} <br />' + 
            'Description: {rink_desc} <br />' + 
            'Last update: ' + last_reading_skateable + ' on ' + last_reading_reading_date + ' <br />' + 
            '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />'
        , feature.properties);
 
        // This sets the icon if there is a reading within the last 7 days and if it is skateable or not skateable
        if(reading_date[0] > days_ago){
          if(reading_skateable[0]==0){
            layer.setIcon(icon_notskateable);
            L.marker(coords).bindPopup(popupContent).addTo(nonskateableLayer);
          }else{
            layer.setIcon(icon_skateable);
            L.marker(coords).bindPopup(popupContent).addTo(skateableLayer);
          }
        }else{
          layer.setIcon(icon_rink_marker);
          L.marker(coords).bindPopup(popupContent).addTo(rinksLayer);
        }
      }

      // Put all the information into the array for use by the app
      rinksReadings[rink_name_data] = [reading_date, reading_skateable, reading_conditions, coords];

    }); // END query.where.orderBy.run
  }, // END onEachFeature

 // pointToLayer: function(geojson, latlng){
 // }, // End pointToLayer
});

console.log("CHECK11");





