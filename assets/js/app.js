console.log("app.js");  

var map;
var all_rinks = {};
var all_readings = {};

// Create the data layers
var rinksLayer = new L.featureGroup();
var skateableLayer = new L.featureGroup();
var notskateableLayer = new L.featureGroup();

// links to the two Survey123 hosted feature services
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_0a3a8fbc198847a3bd5f6dc645c4dcd7_stakeholder/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/service_f8d1476ec5df4d349f953bd14a880be8/FeatureServer/0';
var show_skateable_how_many_days_ago = 7;

getData();
