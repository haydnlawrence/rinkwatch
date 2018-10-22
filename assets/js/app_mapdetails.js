console.log("app_mapdetails.js");     

function setMapProperties(){
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

  /* Basemap Layers */
  var CartoDB_DarkMatter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
  });

  var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 15,
  }), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
    minZoom: 16,
    maxZoom: 19,
    layers: "0",
    format: 'image/jpeg',
    transparent: true,
    attribution: "Aerial Imagery courtesy USGS"
  })]);

  /* Overlay Layers */
  var highlight = L.geoJson(null);
  var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
  };

  // Create the data layers
  var rinksLayer = new L.featureGroup();
  var skateableLayer = new L.featureGroup();
  var notskateableLayer = new L.featureGroup();

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var days_ago = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

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
console.log(rinksReadings)
  Object.keys(rinksReadings).forEach(function(rink){
  //for(var rink=0;rink<rinksReadings.length;rink++){
    var rink_latlng, rink_oid, rink_name, rink_desc, rink_creator, last_reading_date, last_reading_data;

    rink_latlng = rinksReadings[rink][4];
    rink_oid = rinksReadings[rink][5];
    rink_name = rinksReadings[rink][6];
    rink_desc = rinksReadings[rink][7];
    rink_creator = rinksReadings[rink][8];

    // Get the most up to date reading
    last_reading_date = rinksReadings[rink][0][0];
    last_reading_data = rinksReadings[rink][1][0];

    if(last_reading_data==0){
      last_reading_skateable = 'Not Skateable';
    }else{
      last_reading_skateable = 'Skateable';
    }

    // Set up the pop for each rink
    var popupContent = L.Util.template(
      'Creator: ' + rink_creator + ' <br />' + 
      'Rink: ' + rink_name + ' <br />' + 
      'Description: ' + rink_desc + ' <br />' + 
      'Last update: ' + last_reading_skateable + ' on ' + last_reading_date + ' <br />' + 
      '<img src="' + rinks_url + '/' + rink_oid + '/attachments/' + rink_oid + '" style="width:200px;"> <br />'
    ); // popupContent

    // Check to see if the current rink belongs to the currently logged in user
    var currentUser = rink_creator==username ? true : false;
    if(currentUser){
      L.marker(rink_latlng, {icon: icon_owner}).bindPopup(popupContent).addTo(rinksLayer);
    }else{
      // This sets the icon if there is a reading within the last 7 days and if it is skateable or not skateable
      if(last_reading_date > days_ago){
        if(last_reading_data==0){
          L.marker(rink_latlng, {icon: icon_notskateable}).bindPopup(popupContent).addTo(nonskateableLayer);
        }else{
          L.marker(rink_latlng, {icon: icon_skateable}).bindPopup(popupContent).addTo(skateableLayer);
        }
      }else{
        L.marker(rink_latlng, {icon: icon_rink_marker}).bindPopup(popupContent).addTo(rinksLayer);
      }
    }

  }); // END for (rink in rinksReadings)

  // Create and set the map
  var map = L.map("map", {
    zoom: 4,
    center: [45.767523,-87.978516],
    //layers: [usgsImagery, rinks_layer, markerClusters, highlight],
    layers: [usgsImagery, highlight, rinksLayer, skateableLayer, notskateableLayer],
    zoomControl: false,
    attributionControl: false
  });


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

  var baseLayers = {
    "Dark Map": CartoDB_DarkMatter,
    "Aerial Imagery": usgsImagery
  };

  var groupedOverlays = {
    "Rinks": {
      
      "<img src='assets/img/icon_rink_notskateable.png' width='24' height='28'>&nbsp;Not Skateable": notskateableLayer,
      "<img src='assets/img/icon_rink_skateable.png' width='24' height='28'>&nbsp;Skateable": skateableLayer,
      "<img src='assets/img/icon_rink_marker.png' width='24' height='28'>&nbsp;All Rinks": rinksLayer
      //"<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
    }//,
    //"Reference": {
    //  "Pacific Northwest": boroughs
    //}
  };

  var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
  }).addTo(map);

  // // Leaflet patch to make layer control scrollable on touch browsers
  // var container = $(".leaflet-control-layers")[0];
  // if (!L.Browser.touch) {
  //   L.DomEvent
  //   .disableClickPropagation(container)
  //   .disableScrollPropagation(container);
  // } else {
  //   L.DomEvent.disableClickPropagation(container);
  // }
} // END function setMapProperties()



//       // Check to see if it is the user's rink - if so, use special marker icon and possibly specialized pop up box info
//       if(feature.properties.Creator == username){ // This is the user's rink
//         var popupContent = L.Util.template(
//             'Creator: {Creator} <br />' + 
//             'Rink: {rink_name} <br />' + 
//             'Description: {rink_desc} <br />' + 
//             'Last update: ' + last_reading_skateable + ' on ' + last_reading_reading_date + ' <br />' + 
//             '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />'
//         , feature.properties);
//         layer.bindPopup(popupContent);
//         layer.setIcon(icon_owner);
//         var zoom = 10;
//         map.setView(coords, zoom);
//         L.marker(coords).bindPopup(popupContent).addTo(rinksLayer);
//       } else {
//         var popupContent = L.Util.template(
//             'Creator: {Creator} <br />' + 
//             'Rink: {rink_name} <br />' + 
//             'Description: {rink_desc} <br />' + 
//             'Last update: ' + last_reading_skateable + ' on ' + last_reading_reading_date + ' <br />' + 
//             '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />'
//         , feature.properties);
 
//         // This sets the icon if there is a reading within the last 7 days and if it is skateable or not skateable
//         if(reading_date[0] > days_ago){
//           if(reading_skateable[0]==0){
//             layer.setIcon(icon_notskateable);
//             L.marker(coords).bindPopup(popupContent).addTo(nonskateableLayer);
//           }else{
//             layer.setIcon(icon_skateable);
//             L.marker(coords).bindPopup(popupContent).addTo(skateableLayer);
//           }
//         }else{
//           layer.setIcon(icon_rink_marker);
//           L.marker(coords).bindPopup(popupContent).addTo(rinksLayer);
//         }
//       }



      /* Single marker cluster layer to hold all clusters 
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});
*/