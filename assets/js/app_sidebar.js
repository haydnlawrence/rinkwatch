console.log('app_sidebar.js');

function setSideBar(){

  
// $(window).resize(function() {
//   sizeLayerControl();
// });

// $(document).on("click", ".feature-row", function(e) {
//   $(document).off("mouseout", ".feature-row", clearHighlight);
//   sidebarClick(parseInt($(this).attr("id"), 10));
// });

// if ( !("ontouchstart" in window) ) {
//   $(document).on("mouseover", ".feature-row", function(e) {
//     highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
//   });
// }

// $(document).on("mouseout", ".feature-row", clearHighlight);

// $("#about-btn").click(function() {
//   $("#aboutModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#full-extent-btn").click(function() {
//   alert("Show form");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });



// $("#login-btn").click(function() {
//   $("#loginModal").modal("show");
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

// $("#list-btn").click(function() {
//   animateSidebar();
//   return false;
// });

// $("#nav-btn").click(function() {
//   $(".navbar-collapse").collapse("toggle");
//   return false;
// });

// $("#sidebar-toggle-btn").click(function() {
//   animateSidebar();
//   return false;
// });

// $("#sidebar-hide-btn").click(function() {
//   animateSidebar();
//   return false;
// });

// function animateSidebar() {
//   $("#sidebar").animate({
//     width: "toggle"
//   }, 350, function() {
//     map.invalidateSize();
//   });
// }

// function sizeLayerControl() {
//   $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
// }

// function clearHighlight() {
//   highlight.clearLayers();
// }

// function sidebarClick(id) {
//   //var layer = markerClusters.getLayer(id);
// //  var layer = rinks_layer;
// //  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
// //  layer.fire("click");
//   /* Hide sidebar and go to the map on small screens */
//   if (document.body.clientWidth <= 767) {
//     $("#sidebar").hide();
//     map.invalidateSize();
//   }
// }

// function syncSidebar() {
//    Empty sidebar features 
//   $("#feature-list tbody").empty();
//   /* Loop through rinks layer and add only features which are in the map bounds */
//     if (map.hasLayer(rinksLayer)) {
//         var Q = L.esri.query({url: rinks_url}); //change to readings_url once it is working 
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
} // END function setNavigationProperties()