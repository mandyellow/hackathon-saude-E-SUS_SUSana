'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

app.get('/heatmap', function(req, res) {
	//res.type('json');
	res.json({
		date: req.query.date,
		points: [
			{'lat' : '-23,548', 'long' : '-46,6392', 'indicador' : '0.1'},
			{'lat' : '-23,549', 'long' : '-46,6392', 'indicador' : '0.2'},
			{'lat' : '-23,551', 'long' : '-46,6392', 'indicador' : '0.4'},
			{'lat' : '-23,552', 'long' : '-46,6392', 'indicador' : '0.7'},
			{'lat' : '-23,554', 'long' : '-46,6392', 'indicador' : '0.9'}
		]
	});	
}
);

module.exports = app;
