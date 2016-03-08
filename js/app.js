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
	var mapBounds;	// object that will be created from LatLngBounds class (represents a rectangle in geographical coordinates)
	var service;	// object that will be created from PlacesService class (to search for places and retrieve details about a place)

	var defaultNeighborhood = "cleveland ohio";	//for entry in Search Box
	var placeLatitude;
  	var placeLongitude;
  	var markerArray = [];

  	self.venueArray = ko.observableArray('');	// Recommended places from foursquare
  	self.filteredList = ko.observableArray(self.venueArray());	// Filtered list by filtering
  	self.searchTerm = ko.observable('');	// words to be used for search
  	self.keyword = ko.observable('');	//keyword to filter list view

	// update the neighborhood
	// self.computedNeighborhood = ko.computed(function() {
	// 	if (self.neighborhood() != '') {
	// 		if (venueMarkers.length > 0) {
	// 			removeVenueMarkers();
	// 		}
	// 		removeNeighborhoodMarker();
	// 		requestNeighborhood(self.neighborhood());
	// 		self.keyword('');
	// 	}
	// });

  	// When list item is clicked, trigger click event
  	self.gotoMarker = function(venueItem){
  		var venueName = venueItem.name.toLowerCase();
  		markerArray.forEach(function(marker){
  			if(marker.title.toLowerCase() == venueName){
  				google.maps.event.trigger(marker, 'click');
  				map.panTo(marker.position);
  			}
  		});
  	};

  	/*
  	* Display venue info in list view with filtering
  	* @param {Object} venueItem: venue data from foursqare
  	* return {void}
  	*/
  	self.displayVenueInList = ko.computed(function(){
  		var venue;
  		var listArray=[];
  		var keyword = self.keyword().toLowerCase();
  		self.venueArray().forEach(function(venueItem){
  			if(venueItem.name.toLowerCase().indexOf(keyword) != -1 ||
  				venueItem.category.toLowerCase().indexOf(keyword) != -1){
  				listArray.push(venueItem);
  			}
  		})
  		self.filteredList(listArray);
  	});

	// update map markers based on search keyword
	self.displayMarkers = ko.computed(function() {
		var keyword = self.keyword().toLowerCase()

		markerArray.forEach(function(marker){
			if(marker.map === null){
				marker.setMap(map);
			}
			if(marker.title.toLowerCase().indexOf(keyword) === -1 &&
				marker.category.toLowerCase().indexOf(keyword) === -1){
					marker.setMap(null);
			}
		});
	});

	// When submit is commited for filter box, this function is called
	self.filter = function(){
		console.log('hi');
		// self.displayVenueInList();
		// self.displayMarkers();
	}


	// fit map height to window size
	self.mapSize = ko.computed(function() {
		$("#map").height($(window).height());
	});


	function initMap(){
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

  	// =============================== Places for recommended to be shown on map =========================================

  	/*
  	* Initialize Neighborhood (point of interest for city)
  	* @param {string} neighborbhood: A neighborhood location retrieved from user input
  	*/
  	function initNeighborhood(neighborhood){

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
  			$(".list-view").html("<h2>The search results contains a valid data. Reload the page.<h2>");
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
  				console.log(markerArray);

  				//Set bounds according to suggestedBounds from foursqaure
  				var suggestedBounds = data.response.suggestedBounds;
  				// console.log(suggestedBounds);
  				if (suggestedBounds != undefined){
  					mapBounds = new google.maps.LatLngBounds(
  						new google.maps.LatLng(suggestedBounds.sw.lat, suggestedBounds.sw.lng),
  						new google.maps.LatLng(suggestedBounds.ne.lat, suggestedBounds.ne.lng));
  					map.fitBounds(mapBounds);
  				}
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
		    category: venueItem.category,
		    animation: google.maps.Animation.DROP,
		});
		markerArray.push(venueMarker);

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

  	 // Add List View
  	function initListView(venueArray){
  		venueArray.forEach(function(venue){
  			displayVenueInList(venue);
  		})

  		markers.forEach(function(marker){
  			var list_item = '<li class="list-item">';
			list_item += '<h4>' + marker.name  + '</h4>';
			list_item += '<p>' + marker.desc + '</p></li>';

			$(".list-view").append(list_item);
  		});
  	};

  	// When page resizes, map bounds is updated
  	window.addEventListener("resize", function(e){
  		console.log('resize event');
  		map.fitBounds(mapBounds);
  		$("#map").height($(window).height());
  	})

	initMap();
	// addSearchBox();
	initNeighborhood(defaultNeighborhood);
	// initListView();
	// self.displayVenueInList();
};


/*
* Initialize app when Google Maps Script finishes loading
*/
function startMap(){
	var appViewModel = new AppViewModel(); // define then bind AppViewModel
	ko.applyBindings(appViewModel);
}
