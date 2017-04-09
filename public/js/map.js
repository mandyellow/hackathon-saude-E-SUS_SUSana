
var heatLayer;
function render_map(map, day){

		
		map.eachLayer(function (layer) {
		    map.removeLayer(layer);
		});
		var heatLayer;

		var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);


	
		// method that we will use to update the control based on feature properties passed

		function getColor(d) {
			return 'white';
		    return d > 1000 ? '#800026' :
		           d > 500  ? '#BD0026' :
		           d > 200  ? '#E31A1C' :
		           d > 100  ? '#FC4E2A' :
		           d > 50   ? '#FD8D3C' :
		           d > 20   ? '#FEB24C' :
		           d > 10   ? '#FED976' :
		                      '#FFEDA0';
		}

		function style(feature) {
		    return {
		        fillColor: getColor(feature.properties.density),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.3
		    };
		}

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

		function onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: zoomToFeature
		    });
		}
		geojson = L.geoJson(statesData, {
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades.length; i++) {
		        div.innerHTML +=
		            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return div;
		};

		legend.addTo(map);

		var info = L.control();

		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};


		info.update = function (props) {
			console.log(props)
		    // this._div.innerHTML = '<h2>Subprefeitura:'+props.name+'</h2>';
		};

		info.addTo(map);
		var config = {
			quotes: false,
			download:true,
			delimiter: ";",
			header: false,
			complete:function(results, file) {
				var points = results.data;
				var heatpoints = [];
				var mks = [];
			 	for (var p in points) {
			 		var lat = parseFloat(points[p][2]),
			 			lng = parseFloat(points[p][3]),
			 			ind = parseFloat(points[p][4]),
			 			hp = [lat, lng, ind];
			 			mk = [lat, lng];
			 			L.marker(mk).addTo(map);
			 		heatpoints[p] = hp;
			 		mks[p] = mk;
			 	}
			 	console.log(heatpoints)
			 	a = heatpoints.slice(0,10)

				var heatLayer = L.heatLayer(heatpoints, {radius: 35}).addTo(map);
				//var markers = L.marker(mks).addTo(map);
			},
			newline: "\n"
		}
		var data = Papa.parse("csv/data_"+day+".csv",config);


		var config2 = {
			quotes: false,
			download:true,
			delimiter: ";",
			header: false,
			complete:function(results, file) {
				var points = results.data;
				var heatpoints = [];
				var mks = [];
			 	for (var p in points) {
			 		var lat = parseFloat(points[p][2]),
			 			lng = parseFloat(points[p][3]),
			 			ind = parseFloat(points[p][4]),
			 			hp = [lat, lng, ind];
			 			mk = [lat, lng];
			 			L.marker(mk).addTo(map);
			 		mks[p] = mk;
			 	}
				var markers = L.marker(mks).addTo(map);
			},
			newline: "\n"
		}
		var data = Papa.parse("csv/data_20170102.csv",config);

}
var map = L.map('map', {center:[-23.543501,-46.507022], zoom: 12 });
var idx = -1;
function next(){
	idx ++;
	$("#day").html(dates[idx]);
	return dates[idx];
}

function previous(){
	idx --;
	$("#day").html(dates[idx]);
	return dates[idx];
}
render_map(map,next())