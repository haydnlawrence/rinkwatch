console.log("app.js");  

var map;
var all_rinks = {};
var all_readings = {};
var heatmap = [];

var url = new URL(window.location.href);
var temp_start = url.searchParams.get("start");
var temp_end = url.searchParams.get("end");

if(temp_start){
	var filter_startdate = new Date(temp_start);
	var filter_enddate = new Date(temp_end);
}else{
	var filter_startdate = new Date(2012,1,1);
	var filter_enddate = new Date();
}

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
var language = "en";

// This function is purely for bug testing on objects
function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

$(window).load(function(){
	$("#text_enddate").datepicker({
		defaultDate: filter_enddate,
	});
	$("#text_startdate").datepicker({
		defaultDate: filter_startdate,
	});
	$("#text_enddate").val(filter_enddate);
	$("#text_startdate").val(filter_startdate);

	var referrer = document.referrer;
	if(referrer.indexOf("_fr")>=0){
		language = "fr";
		$("#top_logo_link").attr("href", "https://www.rinkwatch.org/index_fr.html");
	}else{
		language = "en";
		$("#top_logo_link").attr("href", "https://www.rinkwatch.org/index.html");
	}
});


$("#about-btn").click(function(){
	if(language=="fr"){
    	window.open('https://www.rinkwatch.org/about_fr.html', '_blank', 'height=600,width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes');
	}else{
		window.open('https://www.rinkwatch.org/about.html', '_blank', 'height=600,width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes');
	}
});

$("#button_filter").click(function() {
	var temp_start = new Date($("#text_startdate").val());
	var temp_end = new Date($("#text_enddate").val());
	var url_start = temp_start.getFullYear() + '/' +  (temp_start.getMonth()+1) + '/' + temp_start.getDate();
	var url_end = temp_end.getFullYear() + '/' +  (temp_end.getMonth()+1) + '/' + temp_end.getDate();
	window.location.href = document.referrer + "?start=" + url_start + "&end=" + url_end;
});

getData();
