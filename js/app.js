// Paramters for FourSquare :
const CLIENT_ID = "YK2TJ1KXUHD535PWNR3DYUBZD0ML4ANPZD21UAPQZZHSVYVO";
const CLIENT_SECRET = "OQ1Q4KCH3VZUD0MHUSFX1AYKV3CKO0MUHBP4Q4KBUL5F01PT"
const FOURSQURE_ID = CLIENT_ID + CLIENT_SECRET;
const V_PARAMETER = "&v=20160307"



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

/*
* Place model. Upon recieving data from Foursquare, this constructor will be used to create data in format.
* @param {Object} item: A data from foursquare for Venue
* return {void}
*/
var Venue = function(item){
	// console.log(item.venue);
	this.id = item.venue.id;
	this.name = item.venue.name;
	this.rating = item.venue.rating;
	this.ratingColor = item.venue.ratingColor;
	this.lat = item.venue.location.lat;	//latitude
	this.lng = item.venue.location.lng;	//longitude
	this.address = item.venue.location.address + ', ' + item.venue.location.city + ', ' + item.venue.location.postalCode;
	// this.formattedAddress = item.venue.location.formattedAddress;
	this.category = item.venue.categories[0].name;
	this.formattedPhone = item.venue.contact.formattedPhone;
	this.url = item.venue.url
	// this.hours = item.venue.hours.status;
	// this.isOpen = this.getIsOpen(this);
	// this.price = item.venue.price.tier;	//returns 1:"Cheap", 2:"Moderate", 3:"Expensive", 4:"Very expensive"
	this.price$ = this.getPrice$(item.venue); //returns 1:"Cheap", 2:"Moderate", 3:"Expensive", 4:"Very expensive"
	// console.log(item.venue.price.tier);
	// TOOD: get photo
	// this.photo = this.getPhoto(this.id);

}

Venue.prototype = {
	getPhoto: function(id){
		var photoURL = "https://api.foursquare.com/v2/venues/" + id + "/photos?" + FOURSQURE_ID + V_PARAMETER;

		$.ajax({
			url: photoURL,
			success: function(photoData){
				console.log(photoData);
			},
			complete: function(){
				console.log("finished process for getting photo");
			},
			error: function(){
				console.log("failed to get photo");
			}
		});
	},
	// Convert number to $ sign to represent price range of venue
	getPrice$: function(venueItem){
		if(venueItem.price && venueItem.price.tier){
			switch(venueItem.price.tier){
				case 1:
					return "$";
				case 2:
					return "$$";
				case 3:
				 	return "$$$";
				case 4:
					return "$$$$";
				default:
					return "N/A";
			}
		}
		else{
			return "N/A";
		}
	},
	// Is restaurant open now?
	getIsOpen: function(venueItem){
		if(venueItem.hours && venueItem.hours.isOpen){
			return venueItem.hours.isOpen;
		}
		else{
			return "N/A";
		}
	}
};


function AppViewModel(){
	var self = this;
	// var infoWindow;
	// var infoWindow = new google.maps.InfoWindow({
	// 	maxWidth: 100
	// });
	var map;	// object that will be created from Map class
	var bound;	// object that will be created from LatLngBounds class (represents a rectangle in geographical coordinates)
	var service;	// object that will be created from PlacesService class (to search for places and retrieve details about a place)

	var defaultNeighborhood = "cleveland ohio";	//for entry in Search Box
	var placeLatitude;
  	var placeLongitude;

  	self.venueArray = ko.observableArray('');	// recommended places from foursquare
  	self.searchTerm = ko.observable('');	// words to be used for search


	self.initMap = function(){
		var mapDiv = document.getElementById('map');
		// var mapDiv = document.querySelector('#map');
		//this js can be replaced with jQuery
		// var mapDiv = $("#map")[0];

		// required parameters: center and zoom
		var cleveland = new google.maps.LatLng(41.493378, -81.700712);
		var mapOptions = {
			zoom: 17,
			center: cleveland,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(mapDiv, mapOptions);

		// TODO: adds search bars and list view onto map, sets styled map
	};

	// Add marker from database
	// self.addMarker = function(){

	// 	for (var i=0; i<markers.length; i++){
	// 		marker = new google.maps.Marker({
	// 		    position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
	// 		    map: map,
	// 		    // draggable: true,
	// 		    animation: google.maps.Animation.DROP,
	// 		    name: markers[i].name,
	// 		    desc: markers[i].desc
	// 		});

	// 		google.maps.event.addListener(marker, 'click', (function(mk){
	// 			return function(){
	// 	      		// infoWindow.open(map, mk);
	// 	      		createInfoWindow(mk);
	// 				toggleBounce(mk);
	// 			}
	// 		})(marker, i));
	// 	}
	// };

	/*
	* Create Info window with text in it for corresponding the google map marker
	* @param {Object} marker: A marker on the map for places
	*/
  // 	function createInfoWindow(marker){
		// /*
		// * Create the DOM element for the marker window
		// * Uses marker data to create Business name, phone number, reviewer's picture, and reviewer's review
		// */
		// var infoWindowContent = '<div class="info_content">';
		// infoWindowContent += '<h4>' + marker.name  + '</h4>';
		// infoWindowContent += '<p>' + marker.desc + '</p>';

  // 		infoWindow.setContent(String(infoWindowContent));
		// /*
		// * Google Map V3 method to set the content of the marker window
		// * Takes map and marker data variable as a parameter
		// */
  // 		infoWindow.open(map, marker);
  // 	};

  	// Add SerchBox
  	self.addSearchBox = function(){
  		// Create the search box with auto complete feature and link it to the UI element
  		// BUT search for city only not the restaurant name and etc.
  		var options = {
			types: ['(cities)'],
			// componentRestrictions: {country: "us"}
		};

  		var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.Autocomplete(input, options);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
        	searchBox.setBounds(map.getBounds());
        });

        /* TODO: the below will need to be replaced so that fourSqure returns places */

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        // searchBox.addListener('places_changed', function() {
        //   var places = searchBox.getPlaces();

        //   if (places.length == 0) {
        //     return;
        //   }

        //   // Clear out the old markers.
        //   markers.forEach(function(marker) {
        //     marker.setMap(null);
        //   });
        //   markers = [];

        //   // For each place, get the icon, name and location.
        //   var bounds = new google.maps.LatLngBounds();
        //   places.forEach(function(place) {
        //     var icon = {
        //       url: place.icon,
        //       size: new google.maps.Size(71, 71),
        //       origin: new google.maps.Point(0, 0),
        //       anchor: new google.maps.Point(17, 34),
        //       scaledSize: new google.maps.Size(25, 25)
        //     };

        //     // Create a marker for each place.
        //     markers.push(new google.maps.Marker({
        //       map: map,
        //       icon: icon,
        //       title: place.name,
        //       position: place.geometry.location
        //     }));

        //     if (place.geometry.viewport) {
        //       // Only geocodes have viewport.
        //       bounds.union(place.geometry.viewport);
        //     } else {
        //       bounds.extend(place.geometry.location);
        //     }
        //   });
        //   map.fitBounds(bounds);
        // });
  	};

  	// Add List View
  	self.addListView = function(){
  		markers.forEach(function(marker){
  			var list_item = '<li class="list-item">';
			list_item += '<h4>' + marker.name  + '</h4>';
			list_item += '<p>' + marker.desc + '</p></li>';

			$(".list-view").append(list_item);
  		});
  	};

  	// =============================== Places for recommended to be shown on map =========================================

  	/*
  	* Initialize Neighborhood (point of interest for city)
  	* @param {string} neighborbhood: A neighborhood location retrieved from user input
  	*/
  	self.initNeighborhood = function(neighborhood){

  		var textSearchRequest = {
  			query: neighborhood	// The request's query term
  		};

  		// Creates a instance of PlacesService to search and retrieve data about a place
  		service = new google.maps.places.PlacesService(map);
  		// Retrieves a list of places based on a query string (textSearchRequest) and runs callback function
  		service.textSearch(textSearchRequest, initNeighborhoodCallback);
  	};

  	/*
  	* See if returned data from search has valid result
  	* @param {Object} placeResult: defines information about a place (google.maps.places.PlaceResult object)
  	* @param {Object} status: status retured by PlacesService on completion of its search
  	* return {void}
  	*/
  	function initNeighborhoodCallback(placeResult, status){
  		if (status == google.maps.places.PlacesServiceStatus.OK){
  			getNeighborhoodPlaces(placeResult[0]);
  		}
  		else {
  			$(".list-view").html("<h2>The search results contains a valid data. Reload the page.<h2>")
  			return;
  		}
  	};

  	/**
  	* Get information about neighborhood places from FourSquare and show them on the google map as marker
	* @param {Object} _place A place object retured by google map search(google.maps.places.PlaceResult)
	* @return {void}
	*/
  	function getNeighborhoodPlaces(place){
  		infoWindow = new google.maps.InfoWindow({
  			maxWidth: 250,
  			// content: "<div class='venue-infoWindow'></div>"
  		});
  		placeLatitude = place.geometry.location.lat();
  		placeLongitude = place.geometry.location.lng();
  		var newNeighborhood = new google.maps.LatLng(placeLatitude, placeLongitude);
  		map.setCenter(newNeighborhood);

  		getFoursquareData();
  	};

  	/*
  	* Get deailts for popular places from Foursquare
  	* @return {void}
  	*/
  	function getFoursquareData(){


  		// // Create URL to send asynchronous HTTP (Ajax) request
  		var foursquareBaseURL = "https://api.foursquare.com/v2/venues/explore?"
  		var forusquareID = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
  		var coordinate = "&ll=" + placeLatitude +',' + placeLongitude;
  		var query = "&query="  + self.searchTerm();
  		var foursquareURL = foursquareBaseURL + forusquareID + coordinate + query + V_PARAMETER  + "&venuePhotos=1";

  		$.ajax({
  			url: foursquareURL,
  			success: function(data){
  				// Put venue items into venueArray
  				var items = data.response.groups[0].items;
  				items.forEach(function(venueItem){
  					self.venueArray.push(new Venue(venueItem));
  				});

  				// set marker for venue item
  				self.venueArray().forEach(function(venueItem){
  					setVenueMarker(venueItem);
  				});
  			},
  			complete: function(data) {
  				if (self.venueArray().length == 0)
  					$(".list-view").html('<h2 style=color:green>No result found. Search with different keywords<h2>');
  			},
  			error: function(data) {
  				$(".list-view").html('<h2 style=color:red>Failed to retrieve data from frousquare. Try again<h2>');
  			}
  		});
  	}

  	function setVenueMarker(venueItem){
  		var infoWindowContent = getContentForInfowindow(venueItem);
  		var venuePosition = new google.maps.LatLng(venueItem.lat, venueItem.lng);

		var venueMarker = new google.maps.Marker({
		    position: venuePosition,
		    map: map,
		    title: venueItem.name,
		    animation: google.maps.Animation.DROP,
		});

		google.maps.event.addListener(venueMarker, 'click', function(){
			infoWindow.setContent(String(infoWindowContent));
			infoWindow.open(map, venueMarker);
			toggleBounce(venueMarker);
		});
  	};

  		/*
	* Bounce marker when clicked
	* @param {Object} marker: A marker on the map for places
	*/
	function toggleBounce(marker){
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
	    		marker.setAnimation(null);
	    	}, 700);
		}
	};


  	/*
  	* prepare contents in info window
  	* @param {Object} venueItem: A venueItem that was recieved from foursquare
  	* @return {string}
  	*/
  	function getContentForInfowindow(venueItem){
  		/* Content formatting for info window:
  		* name,
  		* rating, price
  		* category,
  		* hours
  		* address
  		* phone
  		*/



  		var contentString ="<div class='venue-infoWindow'>"
  							+ "<div class='venue-name'>" + "<a href ='" + venueItem.url + "' target='_blank'>" + venueItem.name + "</a>"
  								+ "<span class='venue-rating' style='background-color:" + venueItem.ratingColor + "'>" + venueItem.rating + "</span></div>"
  							+ "<div class='venue-category'>" + venueItem.category
 								+ (venueItem.price$=="N/A" ?  '</div>' : "<span class='venue-price'>" + venueItem.price$ + "</span></div>")

  							+ "<div class='venue-address'><i class='glyphicon glyphicon-home'></i> " + venueItem.address + "</div>"
  							+ (venueItem.formattedPhone == undefined ? '': "<div class='venue-phone'><i class='glyphicon glyphicon-earphone'></i> "  + venueItem.formattedPhone + "</div>")
  							+ "</div>"

  		return contentString;
  	};

	self.initMap();
	//self.addMarker();
	self.addSearchBox();
	// self.addListView();


	self.initNeighborhood(defaultNeighborhood);
	// getFoursquareData();

};


/*
* Initialize app when Google Maps Script finishes loading
*/
function startMap(){
	var appViewModel = new AppViewModel(); // define then bind AppViewModel
	ko.applyBindings(appViewModel);
}
