var infoWindow;
var infoWindows = [];
var windowContent;
var map;
var marker;
var markers = [];
var redmarker = 'img/red.png';
var bluemarker = 'img/blue.png';
//data array required about the locations to be marked
var locationsModel = [{
    "name": 'Botanical Garden',
    "lat": '11.418783',
    "lng": '76.710663',
    "description": 'The Government Botanical Garden was laid out in 1848. The Gardens, divided into several sections covers an area of around 22 hectares. The garden has a terraced layout and is maintained by the Tamil Nadu Horticulture Department.'
}, {
    "name": 'Rose Garden',
    "lat": '11.405995',
    "lng": '76.708946',
    "description": 'This garden has more than 20,000 varieties of roses of 2,800 cultivars. It is one of the largest collection of roses in India.'
}, {
    "name": 'Dodabetta Peak',
    "lat": '11.400105',
    "lng": '76.73521',
    "description": 'Doddabetta is the highest mountain in the Nilgiri Hills at 2,637 metres (8,650 feet). It is a popular tourist attraction with road access to the summit. It is the fourth highest peak in South India next to Anamudi, Mannamalai and Meesapulimala.'
}, {
    "name": 'Cafe Coffee Day',
    "lat": '11.414796',
    "lng": '76.7091',
    "description": 'Best place to meet, greet and retreat.Brace yourself to be delighted by the signature beverages of CCD.'
}, {
    "name": 'Thunder World',
    "lat": '11.404439',
    "lng": '76.694977',
    "description": 'Place for perfect amusement.Numerous games for kids.'
}, {
    "name": 'Dominos',
    "lat": '11.41046',
    "lng": '76.706792',
    "description": 'Perfect destination for hot pizzas in cool Ooty.'
}];
//Initialize map
function loadMap() {
    var mapOptions = {
        center: new google.maps.LatLng(11.406414, 76.693244),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyles
    };
    //map styling from snazzymaps.com
    var mapStyles = [{
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#444444"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#f2f2f2"
        }]
    }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
            "saturation": -100
        }, {
            "lightness": 45
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#46bcec"
        }, {
            "visibility": "on"
        }]
    }];
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // marker is created for each location
    for (var i = 0; i < locationsModel.length; i++) {
        addMarker(i, locationsModel[i]);
    }

    ko.applyBindings(new ViewModel());
}
//error handling for map
function googleError() {
    alert("Google map fail to load!");
}

function addMarker(i, location) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: map,
        icon: redmarker,
        animation: google.maps.Animation.DROP
    });

    location.marker = marker;

    markers.push(marker);

infoWindow = new google.maps.InfoWindow();

    infoWindows.push(infoWindow);
    //function to specify infowindow and its animation
    (function(marker, location) {
        google.maps.event.addListener(marker, "click", function(e) {
            infoWindow.setContent("<b>" + location.name + "</b><br>" + "<div style = 'width:200px;min-height:60px'>" + "<div id='description'></div>" + location.description + "</div>");
            getWikipediaApi(locationsModel[i].name);
            infoWindow.open(map, marker);
            toggleBounce(marker);
        });
    })(marker, locationsModel[i]);
}
//function to include wikipedia api
function getWikipediaApi(location) {
    var $windowContent = $('#description');
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + location + '&format=json&callback=wikiCallback';
    //error handling

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback"
    }).done(function(response) {
        var articleDescription = response[2][0] + "<i>Source: Wikipedia</i>";
        $windowContent.text('');
        $windowContent.append(articleDescription);
        clearTimeout(wikiRequestTimeout);
    }).fail(function (response) {
        alert("wikipedia article not available");
        });
}

// Adding bouncing animation
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        marker.setIcon(bluemarker); //activated marker
        setTimeout(stopBounce, 1400);

        function stopBounce() {
            marker.setAnimation(null);
            marker.setIcon(redmarker); //restore to default marker
        }
    }
}