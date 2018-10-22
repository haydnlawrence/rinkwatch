console.log("app_getdata.js");
//*****************************************************************************
// rinksReadings is the global array that will hold all information about rinks and their readings
// rinksReadings[username][0] is an array of the reading dates
// rinksReadings[username][1] is an array of the reading data (0 or 1)
// rinksReadings[username][2] is an array of the reading conditions (0 to 4)
// rinksReadings[username][3] is an array of the reading ObjectIDs to create image links
// rinksReadings[username][4] are the rink coordinates [lat, lng]
// rinksReadings[username][5] is the rink ObjectID to create image link
// rinksReadings[username][6] is the rink name
// rinksReadings[username][7] is the rink description
// rinksReadings[username][8] is the rink's creator
//*****************************************************************************

async function startDataQuery(){
  // Query getting all rinks
  L.esri.query({
    url: rinks_url,
  }).run(function(error, feature_rinks){
    $.each(feature_rinks.features, function(x, rink) { 

      var rink_creator = rink.properties.Creator;

      // create temporary arrays for each reading for this particular user
      var reading_date = []; // [0]
      var reading_skateable = []; // [1]
      var reading_conditions = []; // [2]
      var reading_objectid = []; // [3]

      var rink_latlng = [rink.geometry.coordinates[1], rink.geometry.coordinates[0]]; // [4]
      var rink_objectid = rink.properties.ObjectId; // [5]
      var rink_name = rink.properties.rink_name; // [6]
      var rink_desc = rink.properties.rink_desc; // [7]
      var rink_creator = rink.properties.Creator; // [8]

      // Query getting all readings for current user sorted by most recent date
      L.esri.query({
        url: readings_url,
      }).where("Creator='" + rink_creator + "'").orderBy("CreationDate", "DESC").run(function(error, feature_readings){
        if(feature_readings){
          // loop around each reading for this user
          $.each(feature_readings.features, function(i, reading) { 

            // Put all of the readings data into three different arrays later to go into rinksReadings global array
            reading_date.push(new Date(reading.properties.CreationDate)); // [0]
            reading_skateable.push(reading.properties.reading_skateable); // [1]
            reading_conditions.push(reading.properties.reading_conditions); // [2]
            reading_objectid.push(reading.properties.ObjectId); // [3]

          }); // END $.each
        } // END if(feature_readings)
      }); // END query on readings_url
      
      // Put all the information into the array for use by the app
      rinksReadings[rink_creator] = ([reading_date, reading_skateable, reading_conditions, reading_objectid, rink_latlng, rink_objectid, rink_name, rink_desc, rink_creator]);
    }); // END onEachFeature
    setMapProperties();
    setNavigationProperties();
  });
} // END function startDataQuery()

