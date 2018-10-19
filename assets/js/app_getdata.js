console.log("*********");
console.log("Getting rink and reading data from hosted feature services - app_getdata.js")
console.log("*********");

var rinksReadings = {};
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_47bbdd102ad44affb7a5835f9fb4085e/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_c3d35e73bb6e47fbb0b6d17f687a954e/FeatureServer/0';

var map, featureList;

var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
var daysago_7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

var icon_notskateable = L.icon({
    iconUrl: '../img/icon_rink_notskateable.png',
    iconSize: [50,50]
});
var icon_skateable = L.icon({
    iconUrl: '../img/icon_rink_skateable.png',
    iconSize: [50,50]
});
var icon_rink_marker = L.icon({
    iconUrl: '../img/icon_rink_marker.png',
    iconSize: [50,50]
});
var icon_owner = L.icon({
    iconUrl: '../img/icon_rink_owner.png',
    iconSize: [50,50]
}); 

var rinks_layer = L.esri.featureLayer({
    url: rinks_url,
    onEachFeature: function(feature, layer){
      var coords = new L.LatLng(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
      var rink_name_data = feature.properties.rink_name;

      var reading_date = [];
      var reading_skateable = [];
      var reading_conditions = [];

console.log("goodbye");

      L.esri.query({
        url: readings_url,
      }).where("Creator='" + feature.properties.Creator + "'").orderBy("CreationDate", "DESC").run(function(error, featureCollection){
        
        if(featureCollection){
          feature_count = featureCollection.features.length; // get the number of records
          $.each(featureCollection.features, function(i, v) { // loop around each reading for this user

            //counter++; // this is used to determine when we have the last record (i.e. the most recent one)
            reading_date.push(new Date(v.properties.CreationDate));
            reading_skateable.push(v.properties.reading_skateable);
            reading_conditions.push(v.properties.reading_conditions);

           
            //readings.push(parseInt(v.properties.reading_conditions)); // put all data for the chart in the popup box

            
            // if(counter >= feature_count){ // this will activate for the last record in the list of readings ordered by date ASC
            //   if(v.properties.reading_skateable == "0"){  
            //     skateable = 'Not Skateable';
            //     if(today < reading_date){ // if it's a reading from today, change the marker
            //       markersObject[v.properties.Creator] = [new L.marker([v.geometry.coordinates[0],v.geometry.coordinates[1]], {icon:icon_skateable}).addTo(map)];
            //       console.log(markersObject)
            //       //layer.setIcon(icon_notskateable);
            //     } // if
            //   }else if(v.properties.reading_skateable == "1"){
            //     skateable = 'Skateable';
            //     if(today < reading_date){
            //       markersObject[v.properties.Creator] = [new L.marker([v.geometry.coordinates[0],v.geometry.coordinates[1]], {icon:icon_notskateable}).addTo(map)];
            //       console.log(markersObject)
            //     } // if
            //   } // else if
            //} // END if(counter >= feature_count)
          }); // END $.each
        } // END if(featureCollection)

        rinksReadings[rink_name_data] = [reading_date, reading_skateable, reading_conditions];

console.log(rinksReadings);
        
        last_reading_reading_date = rinksReadings[rink_name_data][0][0];
        if(rinksReadings[rink_name_data][1][0]==0){
          last_reading_skateable = 'Not Skateable';
        }else{
          last_reading_skateable = 'Skateable';
        }

        if(feature.properties.Creator == username){ // This is the user's rink
          var popupContent = L.Util.template(
              'Creator: {Creator} <br />' + 
              'Rink: {rink_name} <br />' + 
              'Description: {rink_desc} <br />' + 
              'Last update: ' + last_reading_skateable + ' on ' + last_reading_reading_date + ' <br />' + 
              '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />'
          , feature.properties);
          layer.bindPopup(popupContent);
          map.panTo(coords);
          //****************Query last reading set icon based on red or blue.  Add all data to dictionary. Set zoom.
          //layer.setIcon(icon_owner);
        } else {
          var popupContent = L.Util.template(
              'Creator: {Creator} <br />' + 
              'Rink: {rink_name} <br />' + 
              'Description: {rink_desc} <br />' + 
              'Last update: ' + last_reading_skateable + ' on ' + last_reading_reading_date + ' <br />' + 
              '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />'
          , feature.properties);
          layer.bindPopup(popupContent);
        }
      }); // END query.where.orderBy.run
console.log(rinksReadings);
    }, // END onEachFeature

   // pointToLayer: function(geojson, latlng){
   //   return L.marker(latlng, {
   //     icon: icon_rink_marker
   //   });
   // }, // End pointToLayer
  });
 
 //var rinks = rinks_layer;