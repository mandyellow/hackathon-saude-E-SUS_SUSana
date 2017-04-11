
var heatLayer;


var MapStyle = (function(map){
	var map = map;
	function highlightFeature(e) {

	    var layer = e.target;
	    layer.setStyle({
	        weight: 5,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.7
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
		        fillColor: 'white',
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.3
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

	return{
		init: function(){
			var dayIdx = 0;
		},
		next: function() {
			return dates[++dayIdx];
		},
		previous: function(){
			return dates[--dayIdx];
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
		    map.removeLayer(layer);
		});
		var heatLayer;

		var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		geojson = L.geoJson(statesData, {
		    style: MapStyle(map).style,
		    onEachFeature: MapStyle().onEachFeature
		}).addTo(map);

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

		ctr.heatpoints(function(results, files){
			var heatpoints = results.data.map(function(point){
				return[ parseFloat(point[2]),
		 				parseFloat(point[3]),
		 				parseFloat(point[4])
		 				];

			});
		 	var heatLayer = L.heatLayer(heatpoints, {radius: 30}).addTo(map);
		});
}

var ctr = MapControl();

var map = L.map('map', {center:[-23.543501,-46.507022], zoom: 12 });

