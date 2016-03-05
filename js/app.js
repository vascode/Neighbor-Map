var marker;

// function initMap () {
function initMap(){
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

	var map = new google.maps.Map(mapDiv, mapOptions);

	marker = new google.maps.Marker({
	    position: cleveland,
	    map: map,
	    // draggable: true,
	    animation: google.maps.Animation.DROP,
	    title: 'Hello World!'
	  });

	var contentString = '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
	      '<div id="bodyContent">'+
	      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
	      'sandstone rock formation in the southern part of the '+
	      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
	      'south west of the nearest large town, Alice Springs; 450&#160;km '+
	      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
	      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
	      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
	      'Aboriginal people of the area. It has many springs, waterholes, '+
	      'rock caves and ancient paintings. Uluru is listed as a World '+
	      'Heritage Site.</p>'+
	      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
	      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
	      '(last visited June 22, 2009).</p>'+
	      '</div>'+
	      '</div>';

	var infowindow = new google.maps.InfoWindow({
	    content: contentString
	});

	// marker.addListener('click', toggleBounce);
	marker.addListener('click', function(){
		toggleBounce();
    	infowindow.open(map, marker);
	});
};

function toggleBounce() {
	console.log('hi');
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
    		marker.setAnimation(null);
    	}, 700);
	}
}

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
// window.addEventListener('resize', function(e) {
// 	//Make sure the map bounds get updated on page resize
// 	map.fitBounds(window.mapBounds);
// 	$('#map-canvas').height($(window).height());
// });



// initMap();


// function initialize() {
// 	/*
// 	 * Set the variable for the starting point
// 	 */
//   var waikiki = new google.maps.LatLng(21.284712,  -157.805762);
// 	/*
// 	* Set the variable for the google map option
// 	*/
//   var mapOptions = {
//     zoom: 14,
//     center: waikiki,
//     disableDefaultUI: true
//   };
// 	/*
// 	* create a new map object
// 	*/
//   map = new google.maps.Map(document.getElementById('map'), mapOptions);
// }

// initialize();
