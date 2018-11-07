console.log("app.js");  

var map;
var all_rinks = {};
var all_readings = {};
var heatmap = [];
var filter_startdate = new Date(2012,1,1);
var filter_enddate = new Date();

// Create the data layers
var rinksLayer = new L.featureGroup();
var skateableLayer = new L.featureGroup();
var notskateableLayer = new L.featureGroup();

// links to the two Survey123 hosted feature services
var rinks_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_0a3a8fbc198847a3bd5f6dc645c4dcd7_stakeholder/FeatureServer/0';
var readings_url = 'https://services1.arcgis.com/OAsihu89uae6w8NX/arcgis/rest/services/survey123_6ad07213ca2a41efb780aa534e44da66_stakeholder/FeatureServer/0';
var show_skateable_how_many_days_ago = 7;
var currentUser_latlng = [];  
var currentUser;

// var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// $("#dateSlider").dateRangeSlider({
// 	bounds: {min: filter_startdate, max: filter_enddate},
// 	defaultValues: {min: filter_startdate, max: filter_enddate},
// 	scales: [{
// 		next: function(val){
// 			var next = new Date(val);
// 			return new Date(next.setMonth(next.getMonth() + 1));
// 		},
// 			label: function(val){
// 			return Months[val.getMonth()];
// 		}
// 	}]
// })

function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

// $("#showFilterRange").click(function() {
//         var x = document.getElementById("dateSlider");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// });

document.getElementById("page_loading").style.display = "block";
getData();
document.getElementById("page_loading").style.display = "none";
