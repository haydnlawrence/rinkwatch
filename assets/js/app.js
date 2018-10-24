console.log("app.js");  

var map;
var all_rinks = {};
var all_readings = {};

// Create the data layers
var rinksLayer = new L.featureGroup();
var skateableLayer = new L.featureGroup();
var notskateableLayer = new L.featureGroup();

// links to the two Survey123 hosted feature services
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/service_29b1d3930876401ab63286e490c601f6/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/service_f8d1476ec5df4d349f953bd14a880be8/FeatureServer/0';
var add_readings_form = "https://arcg.is/0aruLi";
var show_skateable_how_many_days_ago = 20000;


$("#enter_rink_data").click(function() {
window.open(add_readings_form);
});

getData();
