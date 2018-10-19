

console.log("***START OF PROGRAM***")
  //********************************************************************

  var clientID = 'sPZnxpFgGypJrX1Y';
  var accessToken;
  var callbacks = [];
  var protocol = window.location.protocol;
  var callbackPage = protocol + '//haydnlawrence.github.io/rinkwatch/callback.html';

  var authPane = document.getElementById('auth');
  var signInButton = document.getElementById('sign-in');

  var token, username = '', firstname = '', email = '';
  
  // this function will open a window and start the oauth process
  function oauth(callback) {
    if(accessToken){
      callback(accessToken);
    } else {
      callbacks.push(callback);
      window.open('https://www.arcgis.com/sharing/oauth2/authorize?client_id='+clientID+'&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(callbackPage), '_blank', 'height=600,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes');
    }
  }

  function getCookie(name)
  {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

  token = getCookie('token');
  if(token!=null){
    console.log("Getting token...");
    username = getCookie('username');
    firstname = getCookie('firstName');
    email = getCookie('email');
    authPane.innerHTML = '<label>Hello ' + firstname + '.</label><br />' + '<a href="https://www.arcgis.com/sharing/oauth2/signout" id="sign-out">Sign out</a>';
  }else{
    if(authPane!=null) {
      authPane.innerHTML = '<a href="#" id="sign-in">Sign In</a>';
    }
  }

  // this function will be called when the oauth process is complete
  window.oauthCallback = function(token) {
    L.esri.get('https://www.arcgis.com/sharing/rest/portals/self', {
      token: token
    }, function(error, response){
      username = response.user.username;
      firstname = response.user.firstName;
      email = response.user.email;
      var expire = new Date();
      expire.setTime(today.getTime() + 3600000*24*14); //two weeks same as ArcGIS Online token expiry
      document.cookie = "token=" + token + ";username=" + username + ";firstname=" + firstname + ";email=" + email  + ";expires="+expire.toGMTString() + ";secure";
      authPane.innerHTML = '<label>Hello ' + firstname + '.</label>';
    });
  };

  signInButton.addEventListener('click', function(e){
    oauth();
    e.preventDefault();
  });

  //********************************************************************

  var markersObject = [];
  var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_47bbdd102ad44affb7a5835f9fb4085e/FeatureServer/0';
  var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_c3d35e73bb6e47fbb0b6d17f687a954e/FeatureServer/0';

var map, featureList;

var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

var icon_notskateable = L.icon({
    iconUrl: 'http://haydnlawrence.github.io/rinkwatch/images/icon_rink_notskateable.png',
    iconSize: [50,50]
});
var icon_skateable = L.icon({
    iconUrl: 'http://haydnlawrence.github.io/rinkwatch/images/icon_rink_skateable.png',
    iconSize: [50,50]
});
var icon_rink_marker = L.icon({
    iconUrl: 'http://haydnlawrence.github.io/rinkwatch/images/icon_rink_marker.png',
    iconSize: [50,50]
});
var icon_owner = L.icon({
    iconUrl: 'http://haydnlawrence.github.io/rinkwatch/images/icon_rink_owner.png',
    iconSize: [50,50]
}); 

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  alert("Show form");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});



$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  //var layer = markerClusters.getLayer(id);
//  var layer = rinks_layer;
//  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
//  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through rinks layer and add only features which are in the map bounds */
    if (map.hasLayer(rinks_layer)) {
        var Q = L.esri.query({url: rinks_url}); //change to readings_url once it is working 
        Q.within(map.getBounds());
        Q.run(function(error, featureCollection){
          //alert(featureCollection);
          if(featureCollection) {  
            for (i = 0; i < featureCollection.features.length; i++) { 
              //console.log('Found ' + featureCollection.features.length + ' features');
              // alert(featureCollection.features[i]..);
              rink_name = featureCollection.features[i].properties.rink_name; //place holders for readings layer
              //reading = featureCollection.features[i].properties.rink_desc; // put all data for the chart in the popup box
              //revise with content we want to show in the side bar - images? 
              $("#feature-list tbody").append('<tr class="feature-row" id="' + i  + '"> <td style="vertical-align: middle;">'+ rink_name +'</td><td class="feature-name">' +  '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
          }
        });
   //   if (map.getBounds().contains(rinks_layer.getLatLng())) {
   //     $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(rinks_layer) + '" lat="' + rinks_layer.getLatLng().lat + '" lng="' + rinks_layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' +  '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    
  
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

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



/* Single marker cluster layer to hold all clusters 
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});
*/
/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
 var rinks_layer = L.esri.featureLayer({
    url: rinks_url,
    onEachFeature: function(feature, layer){

      L.esri.query({
        url: readings_url,
      }).where("Creator='" + feature.properties.Creator + "'").orderBy("CreationDate", "ASC").run(function(error, featureCollection){
        
        var skateable, reading_date, counter = 0, readings = [];
        if(featureCollection){
          feature_count = featureCollection.features.length; // get the number of records
          $.each(featureCollection.features, function(i, v) { // loop around each reading for this user

            counter++; // this is used to determine when we have the last record (i.e. the most recent one)
            reading_date = new Date(v.properties.CreationDate);
            readings.push(parseInt(v.properties.reading_conditions)); // put all data for the chart in the popup box

            layer.Creator = v.properties.Creator;

            if(counter >= feature_count){ // this will activate for the last record in the list of readings ordered by date ASC
              if(v.properties.reading_skateable == "0"){  
                skateable = 'Not Skateable';
                if(today < reading_date){ // if it's a reading from today, change the marker
                  layer.setIcon(icon_notskateable);
                } // if
              }else if(v.properties.reading_skateable == "1"){
                skateable = 'Skateable';
                if(today < reading_date){
                  layer.setIcon(icon_skateable);
                } // if
              } // else if
            } // END if(counter >= feature_count)
          }); // END $.each
        } // END if(featureCollection)

        if(feature.properties.Creator == username){ // This is the user's rink
          var popupContent = L.Util.template(
              'Rink: {rink_name} <br />' + 
              'Description: {rink_desc} <br />' + 
              'Creator: {Creator} <br />' + 
              'Last update: ' + skateable + ' on ' + reading_date + ' <br />' + 
              '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />' +
              'Readings: ' + readings
          , feature.properties);
          layer.bindPopup(popupContent);
        } else {
          var popupContent = L.Util.template(
              'Rink: {rink_name} <br />' + 
              'Description: {rink_desc} <br />' + 
              'Creator: {Creator} <br />' + 
              'Last update: ' + skateable + ' on ' + reading_date + ' <br />' + 
              '<img src="' + rinks_url + '/{ObjectId}/attachments/{ObjectId}" style="width:200px;"> <br />' +
              'Readings: ' + readings
          , feature.properties);
          layer.bindPopup(popupContent);
        }
      }); // END query.where.orderBy.run
    }, // END onEachFeature

   // pointToLayer: function(geojson, latlng){
   //   return L.marker(latlng, {
   //     icon: icon_rink_marker
   //   });
   // }, // End pointToLayer
  });
 
 //var rinks = rinks_layer;

map = L.map("map", {
  zoom: 4,
  center: [45.767523,-87.978516],
  //layers: [usgsImagery, rinks_layer, markerClusters, highlight],
  layers: [usgsImagery, rinks_layer, highlight],
  zoomControl: false,
  attributionControl: false
});


/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === rinks_layer) {
    markerClusters.addLayer(rinks_layer);
    syncSidebar();
  }
  
});

map.on("overlayremove", function(e) {
  if (e.layer === rinks_layer) {
    markerClusters.removeLayer(rinks_layer);
    syncSidebar();
  }
  
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

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





//info.addTo(map); 

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);


//oms.addLayer(rinks_layer);

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}


