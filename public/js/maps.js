



var Maps = (function() {
    var settings = {
      key: 'AIzaSyAktBz0FrxxLO5L5n4nQki7cp_oSXxo2tc',
      stagger_time:       1000, // for elevationPath
      encode_polylines:   false,
      secure:             false,
    };

    return {
        init: function(address){
            var gmAPI = new GoogleMapsAPI(settings);
        },
        getGeoCode: function(address){
            var gmAPI = new GoogleMapsAPI(settings);
            var geocodeParams = {
              "address":    "121, Curtain Road, EC2A 3AD, London UK",
              "components": "components=country:GB",
              "bounds":     "55,-1|54,1",
              "language":   "en",
              "region":     "uk"
            };
            gmAPI.geocode(geocodeParams, function(err, result){
              console.log(result);
            });
        }
    }
    // Initialize the module
    function init() {
        Maps.getGeoCode('')
    }

});