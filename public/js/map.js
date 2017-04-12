
var heatLayer;


var MapStyle = (function(map){
	var map = map;
	function highlightFeature(e) {

	    var layer = e.target;
	    $("#subprefeitura").html(e.target.feature.properties.name);
	    layer.setStyle({
	        weight: 5,
	        color: '#999',
	        dashArray: '2',
	        fillOpacity: 0.1
	    });

	    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	        layer.bringToFront();
	    }
	}
	function resetHighlight(e) {
	    geojson.resetStyle(e.target);
	}
	function zoomToFeature(e) {
	    map.fitBounds(e.target.getBounds());
	    
	}
	
	return {
		style:function(feature){
			return {
		        fillColor: '#000',
		        weight: 4,
		        opacity: 1,
		        color: '#fff',
		        dashArray: '3',
		        fillOpacity: 0.1
		    };
		},
		onEachFeature: function(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: zoomToFeature
		    });
		}


	}

});


// Elementos para alimentar o mapa

var MapControl = (function(map){
	var dayIdx = -1;
	function actual(){
		console.log("Renderizando o dia "+dates[--dayIdx])
		return dates[++dayIdx];
	}

	function parseDay (day) {
		return day.slice(6,8)+"/"+day.slice(4,6)+"/"+day.slice(0,4)
	}

	return{
		init: function(){
			var dayIdx = 0;
		},
		setDay:function(day){
			dayIdx = dates.indexOf(day)
			return parseDay(day);
		},
		next: function(selector) {
			$(selector).html(parseDay(dates[++dayIdx]))
			return parseDay(dates[dayIdx]);
		},
		previous: function(selector){
			$(selector).html(parseDay(dates[--dayIdx]))
			return parseDay(dates[dayIdx]);
		},
		//retorna os pins das unidades de saúde
		pins: function(callback){

			Papa.parse("csv/data_20170101.csv",
				{
					quotes: false,
					download:true,
					delimiter: ";",
					header: false,
					complete:callback,
					newline: "\n"
				}
			);
		},

		heatpoints: function(callback) {
			Papa.parse("csv/data_"+actual()+".csv",
				{
					quotes: false,
					download:true,
					delimiter: ";",
					header: false,
					complete:callback,
					newline: "\n"
				}
			);
		}
	}

	function init(){

	}
});

function render_map(map){
		
		map.eachLayer(function (layer) {
			if (isNaN(layer._heat)) {
				console.log(layer._heat);
		    	map.removeLayer(layer);
		    };
		});
		var heatLayer;

		var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		geojson = L.geoJson(statesData, {
		    style: MapStyle(map).style,
		    onEachFeature: MapStyle(map).onEachFeature
		}).addTo(map);
/*
		ctr.pins(function(results, files){
			results.data.map(function(point){
				L.marker([ 
					parseFloat(point[2]),
					parseFloat(point[3])
		 				])
				.addTo(map);
				return;
			});
		});
*/
		ctr.heatpoints(function(results, files){
			var heatpoints = results.data.map(function(point){
				if (isNaN(parseFloat(point[2])
					|| parseFloat(point[3]))) {
					return[1,1,1];
				};
				return[ parseFloat(point[2]),
		 				parseFloat(point[3]),
		 				parseFloat(point[4])
		 				];

			});
		 	var heatLayer = L.heatLayer(heatpoints, {radius: 30}).addTo(map);
		});
}

var ctr = MapControl();
ctr.next()

var map = L.map('map', {center:[-23.543501,-46.507022], zoom: 12 });

$('select').on('change', function() {
	ctr.setDay(this.value);
	render_map(map);
})

render_map(map)

