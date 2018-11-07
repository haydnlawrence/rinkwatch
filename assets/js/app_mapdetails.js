console.log("app_mapdetails.js");     

function setMapDetails(){
  // set the icons
  var icon_notskateable = L.icon({
      iconUrl: 'assets/img/icon_rink_notskateable.png',
      iconSize: [15,15]
  });
  var icon_skateable = L.icon({
      iconUrl: 'assets/img/icon_rink_skateable.png',
      iconSize: [15,15]
  });
  var icon_rink_marker = L.icon({
      iconUrl: 'assets/img/icon_rink_marker.png',
      iconSize: [15,15]
  });
  var icon_owner = L.icon({
      iconUrl: 'assets/img/icon_rink_owner.png',
      iconSize: [15,15]
  }); 

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

  // Create the data layers
  var rinksLayer = new L.featureGroup();
  var skateableLayer = new L.featureGroup();
  var notskateableLayer = new L.featureGroup();

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var days_ago = new Date(now.getFullYear(), now.getMonth(), now.getDate() - show_skateable_how_many_days_ago);

  var currentUser;
  var currentUser_latlng = [];  

  Object.keys(all_rinks).forEach(function(rink){
  //for(var rink=0;rink<all_rinks.length;rink++){
    var rink_latlng, rink_oid, rink_name, rink_desc, rink_creator, last_reading_date, last_reading_data;
    
    rink_creator = all_rinks[rink][0];
    rink_latlng = all_rinks[rink][1];
    rink_oid = all_rinks[rink][2];
    rink_name = all_rinks[rink][3];
    rink_desc = all_rinks[rink][4];

    // If there are any readings yet otherwise set the last_reading_date to longer so it does not look at it for skateable/not skateable
    if(all_readings[rink]){
      // Get the most up to date reading
      last_reading_date = all_readings[rink][1][0];
      last_reading_data = all_readings[rink][2][0];
      last_reading_condition = all_readings[rink][3][0];
      last_reading_oid = all_readings[rink][4][0];

      if(last_reading_data==0){
        last_reading_skateable = 'Not Skateable';
      }else{
        last_reading_skateable = 'Skateable';
      }
      last_reading_date_formatted = last_reading_date.getDate() + "/" + (last_reading_date.getMonth() + 1) + "/" + last_reading_date.getFullYear();

      // Set up the pop for each rink
      var popupContent = L.Util.template(
        //'Creator: ' + rink_creator + ' <br />' + 
        'Rink: ' + rink_name + ' <br />' + 
        'Description: ' + rink_desc + ' <br />' + 
        'Last update: ' + last_reading_skateable + ' on ' + last_reading_date_formatted + ' <br />' + 
        '<img src="' + rinks_url + '/' + rink_oid + '/attachments/' + rink_oid + '" style="width:200px;" onerror="this.style.display=\'none\'"> <br />'
      ); // popupContent

    }else{
      // Set up the pop for each rink
      last_reading_date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (show_skateable_how_many_days_ago + 7));
      var popupContent = L.Util.template(
        //'Creator: ' + rink_creator + ' <br />' + 
        'Rink: ' + rink_name + ' <br />' + 
        'Description: ' + rink_desc + ' <br />' + 
        'No Updates Yet <br />' + 
        '<img src="' + rinks_url + '/' + rink_oid + '/attachments/' + rink_oid + '" style="width:200px;" onerror="this.style.display=\'none\'"> <br />'
      ); // popupContent
    }

    // Check to see if the current rink belongs to the currently logged in user
    currentUser = rink_creator==username ? true : false;
    currentUser_latlng = [];

    if(currentUser){
      L.marker(rink_latlng, {icon: icon_owner}).bindPopup(popupContent).addTo(rinksLayer);
      currentUser_latlng = rink_latlng;
      if(last_reading_date > days_ago){
        if(last_reading_data==0){
          L.marker(rink_latlng, {icon: icon_notskateable}).bindPopup(popupContent).addTo(notskateableLayer);
        }else{
          L.marker(rink_latlng, {icon: icon_skateable}).bindPopup(popupContent).addTo(skateableLayer);
        }
      }
    }else{
      // This sets the icon if there is a reading within the last 7 days and if it is skateable or not skateable
      if(last_reading_date > days_ago){
        if(last_reading_data==0){
          L.marker(rink_latlng, {icon: icon_notskateable}).bindPopup(popupContent).addTo(notskateableLayer);
          L.marker(rink_latlng, {icon: icon_rink_marker}).bindPopup(popupContent).addTo(rinksLayer);
        }else{
          L.marker(rink_latlng, {icon: icon_skateable}).bindPopup(popupContent).addTo(skateableLayer);
          L.marker(rink_latlng, {icon: icon_rink_marker}).bindPopup(popupContent).addTo(rinksLayer);
        }
      }else{
        L.marker(rink_latlng, {icon: icon_rink_marker}).bindPopup(popupContent).addTo(rinksLayer);
      }
    }

  }); // END for (rink in rinksReadings)

  var basemap_terrain = L.esri.basemapLayer('Terrain');
  var basemap_terrain_labels = L.esri.basemapLayer('TerrainLabels');
  var basemap_imagery = L.esri.basemapLayer('Imagery');
  var basemap_streets = L.esri.basemapLayer('Streets');

  // Create and set the map
  map = L.map("map", {
    zoom: 4,
    center: [45.767523,-87.978516],
    //layers: [usgsImagery, rinks_layer, markerClusters, highlight],
    layers: [basemap_terrain, basemap_terrain_labels, rinksLayer, skateableLayer, notskateableLayer],
    zoomControl: false,
    attributionControl: false
  });

  // THIS IS NOT CURRENTLY WORKING ...
  console.log('username: ' + username)
  if(username!=''){
    map.setView(currentUser_latlng, 6, {animation: true});
  }

  var baseLayers = {
    "Terrain": basemap_terrain,
    "Imagery": basemap_imagery,
    "Streets": basemap_streets
  };

  var groupedOverlays = {
    "Rinks": {
      "<img src='assets/img/icon_rink_notskateable.png' width='24' height='28'>&nbsp;Not Skateable": notskateableLayer,
      "<img src='assets/img/icon_rink_skateable.png' width='24' height='28'>&nbsp;Skateable": skateableLayer,
      "<img src='assets/img/icon_rink_marker.png' width='24' height='28'>&nbsp;All Rinks": rinksLayer
    }//,
    //"Reference": {
    //  "Pacific Northwest": boroughs
    //}
  };

  var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
  }).addTo(map);

  // /* Layer control listeners that allow for a single markerClusters layer */
  // map.on("overlayadd", function(e) {
  //   if (e.layer === rinksLayer) {
  //     markerClusters.addLayer(rinksLayer);
  //     syncSidebar();
  //   }
    
  // });

  // map.on("overlayremove", function(e) {
  //   if (e.layer === rinksLayer) {
  //     markerClusters.removeLayer(rinksLayer);
  //     syncSidebar();
  //   }
    
  // });

  // /* Filter sidebar feature list to only show features in current map bounds */
  // map.on("moveend", function (e) {
  //   syncSidebar();
  // });

  /* Clear feature highlight when map is clicked */
  map.on("click", function(e) {
    highlight.clearLayers();
  });

  /* Attribution control */
  function updateAttribution(e) {
    $.each(map._layers, function(index, layer) {
      if (layer.getAttribution) {
        $("#attribution").html((layer.getAttribution()));
      }
    });
  }
  map.on("layeradd", updateAttribution);
  map.on("layerremove", updateAttribution);

  var attributionControl = L.control({
    position: "bottomright"
  });
  attributionControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
    return div;
  };
  //map.addControl(attributionControl);

  var zoomControl = L.control.zoom({
    position: "bottomright"
  }).addTo(map);

  /* GPS enabled geolocation control set to follow the user's location */
  var locateControl = L.control.locate({
    position: "bottomright",
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: true,
    markerStyle: {
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8
    },
    circleStyle: {
      weight: 1,
      clickable: false
    },
    icon: "fa fa-location-arrow",
    metric: false,
    strings: {
      title: "My location",
      popup: "You are within {distance} {unit} from this point",
      outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
    locateOptions: {
      maxZoom: 18,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000
    }
  }).addTo(map);

  /* Larger screens get expanded layer control and visible sidebar */
  if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
  } else {
    var isCollapsed = false;
  }

} // END function setMapProperties()

