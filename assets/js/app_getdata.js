//*****************************************************************************
// rinksReadings is the global array that will hold all information about rinks and their readings
// rinkReadings[username][0] is an array of the reading dates
// rinkReadings[username][1] is an array of the reading data (0 or 1)
// rinkReadings[username][2] is an array of the reading conditions (0 to 4)
// rinkReadings[username][3] is an array of the reading ObjectIDs to create image links
// rinkReadings[username][4] are the rink coordinates [lat, lng]
// rinkReadings[username][5] is the rink ObjectID to create image link
// rinkReadings[username][6] is the rink name
// rinkReadings[username][7] is the rink description
//*****************************************************************************
var rinksReadings = {};

// links to the two Survey123 hosted feature services
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_47bbdd102ad44affb7a5835f9fb4085e/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_c3d35e73bb6e47fbb0b6d17f687a954e/FeatureServer/0';

var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
var days_ago = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

console.log("hello0")

L.esri.query({
  url: rinks_url,
}).run(function(error, feature_rinks)){
  //onEachFeature: function(feature, layer){
  var rink_creator = feature_rinks.properties.Creator;
console.log("hello1")
  // create temporary arrays for each reading for this particular user
  var reading_date = []; // [0]
  var reading_skateable = []; // [1]
  var reading_conditions = []; // [2]
  var reading_objectid = []; // [3]

  var coords = [feature_rinks.geometry.coordinates[1], feature_rinks.geometry.coordinates[0]]; // [4]
  var rink_objectid = feature_rinks.properties.ObjectId; // [5]
  var rink_name = feature_rinks.properties.rink_name; // [6]
  var rink_desc = feature_rinks.properties.rink_desc; // [7]
  var rink_creator = feature_rinks.properties.Creator; // [8]

  // Query getting all readings for current user sorted by most recent date
  L.esri.query({
    url: readings_url,
  }).where("Creator='" + feature_rinks.properties.Creator + "'").orderBy("CreationDate", "DESC").run(function(error, feature_readings){
console.log("Hello2");
    if(featureCollection){
      // loop around each reading for this user
      $.each(feature_readings.features, function(i, v) { 

        // Put all of the readings data into three different arrays later to go into rinksReadings global array
        reading_date.push(new Date(v.properties.CreationDate)); // [0]
        reading_skateable.push(v.properties.reading_skateable); // [1]
        reading_conditions.push(v.properties.reading_conditions); // [2]
        reading_objectid.push(v.properties.ObjectId); // [3]

      }); // END $.each
    } // END if(featureCollection)

    // Put all the information into the array for use by the app
    rinksReadings[rink_creator] = [reading_date, reading_skateable, reading_conditions, reading_objectid, coords, rink_objectid, rink_name, rink_desc, rink_creator];
console.log("rink_creator: " + rink_creator);
console.log(rinksReadings[rink_creator]);
  } // END query.where.orderBy.run
} // END onEachFeature


console.log("CHECK2");