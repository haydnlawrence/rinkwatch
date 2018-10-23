console.log("app.js");  

var map;
var all_rinks = [];
var all_readings = [];

// Create the data layers
var rinksLayer = new L.featureGroup();
var skateableLayer = new L.featureGroup();
var notskateableLayer = new L.featureGroup();

// links to the two Survey123 hosted feature services
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_47bbdd102ad44affb7a5835f9fb4085e/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_c3d35e73bb6e47fbb0b6d17f687a954e/FeatureServer/0';
var show_skateable_how_many_days_ago = 7;


$("#enter_rink_data").click(function() {
window.open("https://arcg.is/1uCjaS");
});

getData();
