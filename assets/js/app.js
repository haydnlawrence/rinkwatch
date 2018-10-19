
$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    //highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
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

// function syncSidebar() {
//   /* Empty sidebar features */
//   $("#feature-list tbody").empty();
//   /* Loop through rinks layer and add only features which are in the map bounds */
//     if (map.hasLayer(rinks_layer)) {
//         var Q = L.esri.query({url: readings_url}); //change to readings_url once it is working 
//         Q.within(map.getBounds());
//         Q.run(function(error, featureCollection){
//           //alert(featureCollection);
//           if(featureCollection) {  
//             for (i = 0; i < featureCollection.features.length; i++) { 
//               //console.log('Found ' + featureCollection.features.length + ' features');
//               // alert(featureCollection.features[i]..);
//               rink_name = featureCollection.features[i].properties.rink_name; //place holders for readings layer
//               //reading = featureCollection.features[i].properties.rink_desc; // put all data for the chart in the popup box
//               //revise with content we want to show in the side bar - images? 
//               $("#feature-list tbody").append('<tr class="feature-row" id="' + i  + '"> <td style="vertical-align: middle;">'+ rink_name +'</td><td class="feature-name">' +  '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//             }
//           }
//         });
//    //   if (map.getBounds().contains(rinks_layer.getLatLng())) {
//    //     $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(rinks_layer) + '" lat="' + rinks_layer.getLatLng().lat + '" lng="' + rinks_layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' +  '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
//       }
    
  
//   /* Update list.js featureList */
//   featureList = new List("features", {
//     valueNames: ["feature-name"]
//   });
//   featureList.sort("feature-name", {
//     order: "asc"
//   });
// }

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



// Single marker cluster layer to hold all clusters 
// var markerClusters = new L.MarkerClusterGroup({
//   spiderfyOnMaxZoom: true,
//   showCoverageOnHover: false,
//   zoomToBoundsOnClick: true,
//   disableClusteringAtZoom: 16
// });

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
 

map = L.map("map", {
  zoom: 4,
  center: [45.767523,-87.978516],
  //layers: [usgsImagery, rinks_layer, markerClusters, highlight],
  layers: [usgsImagery, skateableLayer, notskateableLayer, rinksLayer, highlight],
  zoomControl: false,
  attributionControl: false
});


// /* Layer control listeners that allow for a single markerClusters layer */
// map.on("overlayadd", function(e) {
//   if (e.layer === rinksLayer) {
//     markerClusters.addLayer(rinksLayer);
//     //syncSidebar();
//   }else if (e.layer === notskateableLayer){
//     markerClusters.addLayer(notskateableLayer);
//     //syncSidebar();
//   }else if (e.layer === skateableLayer){
//     markerClusters.addLayer(skateableLayer);
//     //syncSidebar();
//   }
  
// });

// map.on("overlayremove", function(e) {
//   if (e.layer === rinksLayer) {
//     markerClusters.removeLayer(rinksLayer);
//     syncSidebar();
//   }else if (e.layer === notskateableLayer){
//     markerClusters.removeLayer(notskateableLayer);
//     syncSidebar();
//   }else if (e.layer === skateableLayer){
//     markerClusters.removeLayer(skateableLayer);
//     syncSidebar();
//   }
  
// });

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
