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
	}
];


function ViewModel(){
	var self = this;
	var marker;
	var markerArray = places;
	var infoWindow = new google.maps.InfoWindow();
	var map

		// function initMap () {
	self.initMap = function(){
		// var mapDiv = document.getElementById('map');
		var mapDiv = document.querySelector('#map');
		//this js can be replaced with jQuery
		// var mapDiv = $("#map")[0];

		// required parameters: center and zoom
		var cleveland = new google.maps.LatLng(41.493378, -81.700712);
		var mapOptions = {
			zoom: 15,
			center: cleveland,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		map = new google.maps.Map(mapDiv, mapOptions);

		// TODO: adds search bars and list view onto map, sets styled map
	};

		// this.toggleBounce = function() {
	function toggleBounce(){
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
	    		marker.setAnimation(null);
	    	}, 700);
		}
	}

	// this.getContentString = function(_place){
	function getContentString(_place){
		var contentString = '<div id="content">'+ '<div id="siteNotice">'+'</div>'+
							'<h1 id="firstHeading" class="firstHeading">'+ _place.name +'</h1>'+
							'<div id="bodyContent">'+
							'<p><b>Interesting location description</b></p>'+
							'<p>'+ _place.desc + '<p>' +
							'</div>'+
							'</div>';
    	return contentString;
	};
		/*
	* Function to create Info window for the google map marker
	* Takes the marker data as a parameter
	*/
  	function createInfoWindow(mk, i){
		/*
		* Create the DOM element for the marker window
		* Uses marker data to create Business name, phone number, reviewer's picture, and reviewer's review
		*/
		var infoWindowContent = '<div class="info_content">';
		infoWindowContent += '<h4>' + markerArray[i].name + '</h4>';
		infoWindowContent += '<p>' + markerArray[i].desc + '</p>';

					// var contentString = '<div id="content">'+ '<div id="siteNotice">'+'</div>'+
					// 		'<h1 id="firstHeading" class="firstHeading">'+ markerArray[i].name +'</h1>'+
					// 		'<div id="bodyContent">'+
					// 		'<p><b>Interesting location description</b></p>'+
					// 		'<p>'+ markerArray[i].desc + '<p>' +
					// 		'</div>'+
					// 		'</div>';

			// var infowindow = new google.maps.InfoWindow({
			//     content: infoWindowContent
			// });


		/*
		* Google Map V3 method to set the content of the marker window
		* Takes above infoWindowContent variable as a parameter
		*/
  		infoWindow.setContent(String(infoWindowContent));
  		console.log(String(infoWindowContent));
		/*
		* Google Map V3 method to set the content of the marker window
		* Takes map and marker data variable as a parameter
		*/
  		infoWindow.open(map, mk);
  	}


	self.addMarker = function(){

		for (var i=0; i<markerArray.length; i++){
			marker = new google.maps.Marker({
			    position: new google.maps.LatLng(markerArray[i].lat, markerArray[i].lng),
			    map: map,
			    // draggable: true,
			    animation: google.maps.Animation.DROP
			});

			// var contentString = getContentString(markerArray[i]);
			// var contentString = '<div id="content">'+ '<div id="siteNotice">'+'</div>'+
			// 				'<h1 id="firstHeading" class="firstHeading">'+ markerArray[i].name +'</h1>'+
			// 				'<div id="bodyContent">'+
			// 				'<p><b>Interesting location description</b></p>'+
			// 				'<p>'+ markerArray[i].desc + '<p>' +
			// 				'</div>'+
			// 				'</div>';

			// var infoWindow = new google.maps.InfoWindow({
			//     content: contentString
			// });
			// var infoWindow = new google.maps.InfoWindow();

			google.maps.event.addListener(marker, 'click', (function(mk, i){
				return function(){
		      		// infoWindow.open(map, mk);
		      		createInfoWindow(mk, i);
					toggleBounce();
				}
			})(marker, i));
		}
	}
	/**
 	 * if this marker has no animation, disable other marker's animation
 	 * set this marker's animation to bounce
	 * @param {Object} venueMarker A venue marker object
 	 * @return {void}
 	 */
	function selectedMarkerBounce(venueMarker) {
		// if this venue marker has no animation
		if (venueMarker.getAnimation() == null) {
			// set this marker as selected marker
			self.selectedMarker(venueMarker);
			// disable other venue's animation
			self.topPicks().forEach(function(venue) {
				venue.marker.setAnimation(null);
			});
			// set this marker's aniamtion to bounce
			venueMarker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}
	self.initMap();
	self.addMarker();
};


/*
* @description callback function to initialize app when Google Maps Script finishes loading
*/
function startMap(){
	// initMap(); // initialize the map

	var viewModel = new ViewModel(); // define then bind viewModel
	ko.applyBindings(viewModel);

	// viewModel.initMap();
}


    // /**
    //  * Takes a PlaceResult object and puts a marker on the map at its location.
    //  * @param {Object} place A PlaceResult object returned from a Google Places
    //  *   Library request.
    //  * @return {Object} marker A Google Maps Marker objecte to be placed on the
    //  *   map.
    //  */
    // function createMarker(place) {
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: place.geometry.location,
    //     });
    //     // When a marker is clicked scroll the corresponding list view element
    //     // into view and click it.
    //     google.maps.event.addListener(marker, 'click', function () {
    //         document.getElementById(place.id).scrollIntoView();
    //         $('#' + place.id).trigger('click');
    //     });
    //     return marker;
    // }