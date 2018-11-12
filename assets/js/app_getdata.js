console.log("app_getdata.js");

//*****************************************************************************
// all_rinks is the global array that will hold all information about rinks 
// all_rinks[username][0] is the username of the creator of the rink
// all_rinks[username][1] are the rink coordinates [lat, lng]
// all_rinks[username][2] is the objectID of the rink
// all_rinks[username][3] is the name of the rink
// all_rinks[username][4] is the description of the rink
//*****************************************************************************
// all_readings is the global array that will hold all information about readings 
// all_readings[username][0] is the username of the creator of the reading (and hence the rink it's attached to)
// all_readings[username][1] is an array of the reading dates
// all_readings[username][2] is an array of the reading data (0 or 1)
// all_readings[username][3] is an array of the reading conditions (0 to 4)
// all_readings[username][4] is an array of the reading ObjectIDs to create image links
//*****************************************************************************

function getData(){
  // This is to counter the asynchrosity of the queries when two are needed
  // Get all the rinks and readings with "username", which is a unique identifier and create one array 
  // Get rinks --> then get readings --> then put them together and finish loading code
  var check_rinks = false;
  var check_readings = false;
  var countreadings=0;

  var promise_rinks = new Promise(function(resolve, reject) {
    L.esri.query({
      url: rinks_url,
    }).run(function(error, feature_rinks){
      $.each(feature_rinks.features, function(x, rink) { 
        var rink_latlng = [rink.geometry.coordinates[1], rink.geometry.coordinates[0]]; 
        var rink_objectid = rink.properties.objectid; 
        var rink_name = rink.properties.rink_name;
        var rink_desc = rink.properties.rink_desc; 

        // This is purely for legacy data ported over from the old system
        if(rink.properties.Creator != 'colinr23'){
          var rink_creator = rink.properties.Creator; 
        }else{
          var rink_creator = rink.properties.username; 
        }

        all_rinks[rink_creator] = ([rink_creator, rink_latlng, rink_objectid, rink_name, rink_desc]);
      }); // END $.each

      // Both queries will check if the other is done.  If it is, then resolve this promise and continue with code execution
      if(check_readings){
        resolve('Completed both queries.');
      }else{
        check_rinks = true;
      }
      
      if(username){
        if(all_rinks[username]){
          enterRinkDataMenu.innerHTML = '<i class="fa fa-globe white"></i>&nbsp;&nbsp;Enter Rink Data';
          $("#enter_rink_data").click(function() {
            window.open("https://arcg.is/qiiXS", "Enter Readings", "height=600,width=400");
          });
        }else{
          enterRinkDataMenu.innerHTML = '<i class="fa fa-globe white"></i>&nbsp;&nbsp;Create Rink';
          $("#enter_rink_data").click(function() {
            window.open("https://arcg.is/1i9nWz", "Enter Readings", "height=600,width=400");
            enterRinkDataMenu.innerHTML = '<i class="fa fa-globe white"></i>&nbsp;&nbsp;Enter Rink Data';
          });  
        }
      } 
    }); // END .run

    var temp_startdate = filter_startdate.getFullYear() + '-' +  (filter_startdate.getMonth()+1) + '-' + filter_startdate.getDate();
    var temp_enddate = filter_enddate.getFullYear() + '-' +  (filter_enddate.getMonth()+1) + '-' + filter_enddate.getDate();

    L.esri.query({
      url: readings_url,
    }).where("reading_date >= '" + temp_startdate + "' and reading_date <= '" + temp_enddate + "'").orderBy("Creator", "DESC").orderBy("reading_date", "DESC").run(function(error, feature_readings){
      var reading_creator_last = '';
      var reading_creator = '';

      if(feature_readings){
        // loop around each reading for this user
        var reading_date = []; 
        var reading_skateable = []; 
        var reading_conditions = []; 
        var reading_objectid = []; 

        $.each(feature_readings.features, function(i, reading) { 
          countreadings++;
          // This is purely for legacy data ported over from the old system
          if(reading.properties.Creator != 'colinr23'){
          //if(reading.properties.username == '' | reading.properties.username != null){
            var reading_creator = reading.properties.Creator; 
          }else{
            var reading_creator = reading.properties.username; 
          }


          if(reading_creator != reading_creator_last ){
            if(reading_creator_last != ''){
              all_readings[reading_creator_last] = ([reading_creator_last, reading_date, reading_skateable, reading_conditions, reading_objectid]);
            }
            reading_creator_last = reading_creator
            reading_date = []; 
            reading_skateable = []; 
            reading_conditions = []; 
            reading_objectid = []; 
          }
          // Put all of the readings data into three different arrays later to go into rinksReadings global array
          reading_date.push(new Date(reading.properties.reading_date)); 
          reading_skateable.push(reading.properties.reading_skateable); 
          reading_conditions.push(reading.properties.reading_conditions); 
          reading_objectid.push(reading.properties.objectid); 
        }); // END $.each
        all_readings[reading_creator] = ([reading_creator, reading_date, reading_skateable, reading_conditions, reading_objectid]);
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
    // Call map functions after queries are completed
    setMapDetails();
    //setSideBar(); 

    console.log("Rinks: " + ObjectLength(all_rinks));
    console.log("Readings: " + countreadings);
    console.log(all_rinks);
    console.log(all_readings);

  }); // END promise_readings.then

} // END function getData()

