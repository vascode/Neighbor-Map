 "use strict";
 // Paramters for FourSquare :
var CLIENT_ID = "YK2TJ1KXUHD535PWNR3DYUBZD0ML4ANPZD21UAPQZZHSVYVO";
var CLIENT_SECRET = "OQ1Q4KCH3VZUD0MHUSFX1AYKV3CKO0MUHBP4Q4KBUL5F01PT";
var FOURSQURE_ID = CLIENT_ID + CLIENT_SECRET;
var V_PARAMETER = "&v=20160307";

/*
* Venue model. Upon recieving data from Foursquare, this constructor will be used to create data in format.
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
	this.address = item.venue.location.address + ', ' + 
                item.venue.location.city + ', ' + 
                item.venue.location.postalCode;
	// this.formattedAddress = item.venue.location.formattedAddress;
	this.category = item.venue.categories[0].name;
	this.formattedPhone = item.venue.contact.formattedPhone? 
                        item.venue.contact.formattedPhone : "No phone number";
	this.url = item.venue.url? item.venue.url : "No website";
	// this.hours = item.venue.hours.status;
	// this.isOpen = this.getIsOpen(this);
	// this.price = item.venue.price.tier;	//returns 1:"Cheap", 2:"Moderate", 3:"Expensive", 4:"Very expensive"
	this.price$ = this.getPrice$(item.venue); //returns 1:"Cheap", 2:"Moderate", 3:"Expensive", 4:"Very expensive"
	// console.log(item.venue.price.tier);
	// TOOD: get photo
	// this.photo = this.getPhoto(this.id);

};

Venue.prototype = {
	getPhoto: function(id){
		var photoURL = "https://api.foursquare.com/v2/venues/" + id + "/photos?" + 
                    FOURSQURE_ID + V_PARAMETER;

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
	var infoWindow;
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

  	self.venueArray = ko.observableArray();	// Recommended places from foursquare
  	self.filteredList = ko.observableArray(self.venueArray());	// Filtered list by filtering
  	self.searchTerm = ko.observable('');	// words to be used for search
  	self.keyword = ko.observable('');	//keyword to filter list view

  	self.fourSquareMessage = ko.observable('');

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
  		var listArray=[];
  		var keyword = self.keyword().toLowerCase();
  		self.venueArray().forEach(function(venueItem){
  			if(venueItem.name.toLowerCase().indexOf(keyword) != -1 ||
  				venueItem.category.toLowerCase().indexOf(keyword) != -1){
  				listArray.push(venueItem);
  			}
  		});
  		self.filteredList(listArray);
      // console.log(self.filteredList());
  	});

    /*
    * Available keyword for autocomplete in filterBox
    */
    self.availableKeywords = ko.computed(function(){
      var tmpArray = [];
      self.venueArray().forEach(function(venueEntry){
        venueEntry.name.split(' ').forEach(function(nameEntry){
          nameEntry.replace(/,/g, "");
          if(jQuery.inArray(nameEntry, tmpArray) === -1)
            tmpArray.push(nameEntry);
        });

        venueEntry.category.split(' ').forEach(function(categoryEntry){
          categoryEntry.replace(/,/g, "");
          if(jQuery.inArray(categoryEntry, tmpArray) === -1)
            tmpArray.push(categoryEntry);
        });
      });

      $(".filter-bar").autocomplete({
               source: tmpArray,
               appendTo: ".autocomplete-result",
               open: function(){
                  var position = $(".autocomplete-result").position(),
                      left = position.left,
                      top = position.top;

                  $(".autocomplete-result > ul").css({left: (left - 260) + "px", top: (top -5) + "px"});
               }
      });
      if (window.mobilecheck()){
        $(".filter-bar").autocomplete( "option", "disabled", true );
      }
      // return tmpArray;
    }).extend({ rateLimit: 10});

  /*
  * Update map markers based on search keyword
  */
	self.displayMarkers = ko.computed(function() {
		var keyword = self.keyword().toLowerCase();

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
		// self.displayVenueInList();
		// self.displayMarkers();
	};

	// fit map height to window size
	self.mapSize = ko.computed(function() {
		$("#map").height($(window).height());
	});


	function initMap(){
		var mapDiv = document.getElementById('map');

		// required parameters: center and zoom
		var cleveland = new google.maps.LatLng(41.493378, -81.700712);
		var mapOptions = {
			zoom: 17,
			center: cleveland,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(mapDiv, mapOptions);
	}

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
  	}

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
  	}

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
  	}

  	/*
  	* Get deailts for popular places from Foursquare
  	* @return {void}
  	*/
  	function getFoursquareData(){

  		// // Create URL to send asynchronous HTTP (Ajax) request
  		var foursquareBaseURL = "https://api.foursquare.com/v2/venues/explore?";
  		var forusquareID = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
  		var coordinate = "&ll=" + placeLatitude +',' + placeLongitude;
  		var query = "&query="  + self.searchTerm();
  		var foursquareURL = foursquareBaseURL + forusquareID + coordinate + 
                          query + V_PARAMETER  + "&venuePhotos=1";

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
  				// console.log(markerArray);

  				//Set bounds according to suggestedBounds from foursqaure
  				var suggestedBounds = data.response.suggestedBounds;
  				// console.log(suggestedBounds);
  				if (suggestedBounds !== undefined){
  					mapBounds = new google.maps.LatLngBounds(
  						new google.maps.LatLng(suggestedBounds.sw.lat, suggestedBounds.sw.lng),
  						new google.maps.LatLng(suggestedBounds.ne.lat, suggestedBounds.ne.lng));
  					map.fitBounds(mapBounds);
  				}
  			},
        /* The below code is commented out because there is no case of getting no data in this app */
  			// complete: function(data) {
  			// 	if (self.venueArray().length === 0)
  			// 		// $(".list-view").html('<h2 style=color:green>No result found. Search with different keywords<h2>');
  			// 		console.log('No result found. Search with different keywords');

  			// },
  			error: function(data) {
  				// $(".list-view").html('<h2 style=color:red>Failed to retrieve data from frousquare. Try again<h2>');
  				self.fourSquareMessage('Failed to retrieve data from Foursquare. Try again');
  				// console.log(self.fourSquareMessage());
  				// alert("error");
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
  	}

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
	}

  	/*
  	* prepare contents in info window
  	* @param {Object} venueItem: A venueItem that was recieved from foursquare
  	* @return {string}
  	*/
  	function getContentForInfowindow(venueItem){
  		/* Content formatting for info window:
  		* name, rating
  		* category, price level
  		* address
  		* phone #
  		*/

  		var contentString ="<div class='venue-infoWindow'>" +
  							 "<div class='venue-name'>" + "<a href ='" + venueItem.url + "' target='_blank'>" + venueItem.name + "</a>" +
  							 "<span class='venue-rating' style='background-color: #" + venueItem.ratingColor + "'>" + venueItem.rating + "</span></div>" +
  							 "<div class='venue-category'>" + venueItem.category +
 							 (venueItem.price$=="N/A" ?  '</div>' : "<span class='venue-price'>" + venueItem.price$ + "</span></div>") +
  							 "<div class='venue-address'><i class='glyphicon glyphicon-home'></i> " + venueItem.address + "</div>" +
  							 (venueItem.formattedPhone === undefined ? '': "<div class='venue-phone'><i class='glyphicon glyphicon-earphone'></i> "  + venueItem.formattedPhone + "</div>") +
  							 "</div>";

  		return contentString;
  	}

  	// When page resizes, map bounds is updated
  	window.addEventListener("resize", function(e){
  		// console.log('resize event');
  		map.fitBounds(mapBounds);
  		$("#map").height($(window).height());
  	});

	initMap();
	initNeighborhood(defaultNeighborhood);
}

//Check if device is mobile
window.mobilecheck = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

/*
* Initialize app when Google Maps Script finishes loading
*/
function startMap(){

	var appViewModel = new AppViewModel(); // define then bind AppViewModel
	ko.applyBindings(appViewModel);
	setTimeout(function(){
		// $(".message-div").css("display", "none");
		// $(".loading").css("display", "none");
		$(".loading").css("visibility", "hidden");

	}, 3000);

}

// if (typeof google === 'undefined') {
// 	$(".loading").css("display", "none");
// }

/*
* Called when google map is not loaded properly
*/
function googleError(){
	document.querySelector(".loading").style.visibility = "hidden";
	document.querySelector(".no-filtered-list").style.visibility = "hidden";
  document.querySelector(".fourSquare-message").style.visibility = "hidden";
	document.querySelector(".google-map-error").style.visibility = "visible";

  
}
