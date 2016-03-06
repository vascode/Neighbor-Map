// Model for places
// TODO : this will be replaced by a function for getting data from fourSqure
var places= [
	{
		'name': "Bar Louie",
		'lat': 41.50094,
		'lng': -81.69586,
		'desc': "Restaurant, Bar, and Cocktail Bar · Downtown Cleveland"
	},
	{
		'name': "House of Blues",
		'lat': 41.49917,
		'lng': -81.69066,
		'desc': 'Music Venue and Bar · Downtown Cleveland'
	},
	{
		'name': "West Side Market",
		'lat': 41.48469,
		'lng': -81.70306,
		'desc': 'Market · Ohio City'
	},
	{
		'name': 'Hard Rock Cafe Cleveland',
		'lat': 41.497942,
		'lng': -81.693979,
		'desc': 'American Restaurant and Bar · Downtown Cleveland'
	}
];


function ViewModel(){
	var self = this;
	var marker;
	var markerArray = places;
	var infoWindow = new google.maps.InfoWindow({
		maxWidth: 200
	});
	var map

		// function initMap () {
	self.initMap = function(){
		var mapDiv = document.getElementById('map');
		// var mapDiv = document.querySelector('#map');
		//this js can be replaced with jQuery
		// var mapDiv = $("#map")[0];

		// required parameters: center and zoom
		var cleveland = new google.maps.LatLng(41.493378, -81.700712);
		var mapOptions = {
			zoom: 15,
			center: cleveland,
			// disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(mapDiv, mapOptions);

		// TODO: adds search bars and list view onto map, sets styled map
	};


	self.addMarker = function(){

		for (var i=0; i<markerArray.length; i++){
			marker = new google.maps.Marker({
			    position: new google.maps.LatLng(markerArray[i].lat, markerArray[i].lng),
			    map: map,
			    // draggable: true,
			    animation: google.maps.Animation.DROP,
			    name: markerArray[i].name,
			    desc: markerArray[i].desc
			});

			google.maps.event.addListener(marker, 'click', (function(mk){
				return function(){
		      		// infoWindow.open(map, mk);
		      		createInfoWindow(mk);
					toggleBounce(mk);
				}
			})(marker, i));
		}
	};

	/*
	* Bounce marker when clicked
	* @param {Object} _marker: marker on the map for places
	*/
	function toggleBounce(_marker){
		if (_marker.getAnimation() !== null) {
			_marker.setAnimation(null);
		} else {
			_marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
	    		_marker.setAnimation(null);
	    	}, 700);
		}
	}

	/*
	* Create Info window with text in it for corresponding the google map marker
	* @param {Object} _marker: marker on the map for places
	*/
  	function createInfoWindow(_marker){
		/*
		* Create the DOM element for the marker window
		* Uses marker data to create Business name, phone number, reviewer's picture, and reviewer's review
		*/
		var infoWindowContent = '<div class="info_content">';
		infoWindowContent += '<h4>' + _marker.name  + '</h4>';
		infoWindowContent += '<p>' + _marker.desc + '</p>';

  		infoWindow.setContent(String(infoWindowContent));
		/*
		* Google Map V3 method to set the content of the marker window
		* Takes map and marker data variable as a parameter
		*/
  		infoWindow.open(map, _marker);
  	}

  	self.initAutocomplete = function(){
  		// Create the search box and link it to the UI element
  		var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
        	searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

  	}

	self.initMap();
	self.addMarker();
	self.initAutocomplete();
};


/*
* Initialize app when Google Maps Script finishes loading
*/
function startMap(){
	var viewModel = new ViewModel(); // define then bind viewModel
	ko.applyBindings(viewModel);
}
