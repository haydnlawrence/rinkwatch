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
async function getData_rinks(){
 
} // END function getData_rinks()   

  
async function getData_readings(){
  // Query getting all readings for current user sorted by most recent date
  var reading_creator_last = '';
  var reading_creator = '';
  
  L.esri.query({
    url: readings_url,
  }).orderBy("Creator", "DESC").orderBy("reading_date", "DESC").run(function(error, feature_readings){
    if(feature_readings){

      // loop around each reading for this user
      var reading_date = []; // [0]
      var reading_skateable = []; // [1]
      var reading_conditions = []; // [2]
      var reading_objectid = []; // [3]

      $.each(feature_readings.features, function(i, reading) { 

        reading_creator = reading.properties.Creator;

        if(reading_creator != reading_creator_last ){
          if(reading_creator_last != ''){
            all_readings.push([reading_creator_last, reading_date, reading_skateable, reading_conditions, reading_objectid]);
          }
          reading_creator_last = reading_creator
          reading_date = []; // [0]
          reading_skateable = []; // [1]
          reading_conditions = []; // [2]
          reading_objectid = []; // [3]
        }
        // Put all of the readings data into three different arrays later to go into rinksReadings global array
        reading_date.push(new Date(reading.properties.reading_date)); // [0]
        reading_skateable.push(reading.properties.reading_skateable); // [1]
        reading_conditions.push(reading.properties.reading_conditions); // [2]
        reading_objectid.push(reading.properties.ObjectId); // [3]

      }); // END $.each
      all_readings.push([reading_creator, reading_date, reading_skateable, reading_conditions, reading_objectid]);

    } // END if(feature_readings)
    return "Readings Success";
  }); // END query on readings_url
} // END function getData_readings()

function getData(){

  // This is to counter the asynchrosity of the queries when two are needed
  // Get all the rinks and readings with "creator", which is a unique identifier and create one array 
  // Get rinks --> then get readings --> then put them together and finish loading code
  var check_rinks = false;
  var check_readings = false;

  var promise_rinks = new Promise(function(resolve, reject) {
    L.esri.query({
      url: rinks_url,
    }).orderBy("Creator", "DESC").run(function(error, feature_rinks){
      $.each(feature_rinks.features, function(x, rink) { 

        var rink_latlng = [rink.geometry.coordinates[1], rink.geometry.coordinates[0]]; // [4]
        var rink_objectid = rink.properties.ObjectId; // [5]
        var rink_name = rink.properties.rink_name; // [6]
        var rink_desc = rink.properties.rink_desc; // [7]
        var rink_creator = rink.properties.Creator; // [8]

        all_rinks.push([rink_creator, rink_latlng, rink_objectid, rink_name, rink_desc]);
      }); // END $.each

      // Both queries will check if the other is done.  If it is, then resolve this promise and continue with code execution
      if(check_readings){
        resolve('Completed both queries.');
      }else{
        check_rinks = true;
      }
    }); // END .run

    // Query getting all readings for current user sorted by most recent date
    var reading_creator_last = '';
    var reading_creator = '';
    
    L.esri.query({
      url: readings_url,
    }).orderBy("Creator", "DESC").orderBy("reading_date", "DESC").run(function(error, feature_readings){
      if(feature_readings){

        // loop around each reading for this user
        var reading_date = []; // [0]
        var reading_skateable = []; // [1]
        var reading_conditions = []; // [2]
        var reading_objectid = []; // [3]

        $.each(feature_readings.features, function(i, reading) { 

          reading_creator = reading.properties.Creator;

          if(reading_creator != reading_creator_last ){
            if(reading_creator_last != ''){
              all_readings.push([reading_creator_last, reading_date, reading_skateable, reading_conditions, reading_objectid]);
            }
            reading_creator_last = reading_creator
            reading_date = []; // [0]
            reading_skateable = []; // [1]
            reading_conditions = []; // [2]
            reading_objectid = []; // [3]
          }
          // Put all of the readings data into three different arrays later to go into rinksReadings global array
          reading_date.push(new Date(reading.properties.reading_date)); // [0]
          reading_skateable.push(reading.properties.reading_skateable); // [1]
          reading_conditions.push(reading.properties.reading_conditions); // [2]
          reading_objectid.push(reading.properties.ObjectId); // [3]

        }); // END $.each
        all_readings.push([reading_creator, reading_date, reading_skateable, reading_conditions, reading_objectid]);
      } // END if(feature_readings)

      // Both queries will check if the other is done.  If it is, then resolve this promise and continue with code execution
      if(check_rinks){
        resolve('Completed both queries.');
      }else{
        check_readings = true;
      }
    }); // END query on readings_url
  }); // END promise_rinks

  promise_rinks.then(function(value) {
    console.log(all_rinks[0]);
    console.log(all_readings[1][1][0]);
    // Call map functions
    setMapDetails();
    setSideBar();    
  }); // END promise_readings.then

} // END function getData()

