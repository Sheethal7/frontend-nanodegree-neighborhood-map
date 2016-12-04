var ViewModel = function() {
    var self = this;
    //Includes options to click on a location and update infowindow
    self.setLoc = function(clickedLocation) {
        var markerReference;
        var k = locationsModel.length;
        for (var i = 0; i < k; i++) {
            if (locationsModel[i].name == clickedLocation.name) {
                markerReference = markers[i];
                toggleBounce(markerReference);
                infoWindow.setContent("<b>" + locationsModel[i].name + "</b><br>" + "<div style = 'width:200px;min-height:60px'>" + "<div id='description'></div>" + locationsModel[i].description + "</div>");
                getWikipediaApi(locationsModel[i].name);
                infoWindow.open(map, markerReference);
            }
        }
    };

    self.query = ko.observable('');

    self.search = ko.computed(function() {

        return ko.utils.arrayFilter(locationsModel, function(point) {
            if (point.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                point.marker.setVisible(true); // Shows markers if name matches query
                return true;
            }
            point.marker.setVisible(false);
            return false;
        });
    });
};
