Template.pickAddress.mapStyles = [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}]
Template.pickAddress.address = {}
Template.pickAddress.initGMaps = function(){
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };
    
    var myOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: Template.pickAddress.mapStyles
    };

    var map = new google.maps.Map(document.getElementById('map'), myOptions);
    
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });
    
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'),{ types: ['address'] });
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            $('#map').show();
            google.maps.event.trigger(map, 'resize');
            var place = autocomplete.getPlace();
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                  Template.pickAddress.address[addressType] = place.address_components[i][componentForm[addressType]];
                }
            }
            Template.pickAddress.address.externalId = place.place_id;
            marker.setVisible(false);
            if(place.geometry){
                Template.pickAddress.address.location = place.geometry.location;
                
                if (place.geometry.viewport) {
                  map.fitBounds(place.geometry.viewport);
                } 
                else {
                  map.setCenter(place.geometry.location);
                  map.setZoom(14);
                }
                marker.setIcon(/** @type {google.maps.Icon} */({
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(35, 35)
                }));
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);
            }
            Hembu.methods.address.find({externalId:place.place_id}, function(err, result){
                Template.pickAddress.address = result;
                $('#create').hide();
                $('#join').show();
            })
            console.log(place, Template.pickAddress.address)
        });
}
Template.pickAddress.rendered = function(){
    if(!window.google){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=Template.pickAddress.initGMaps';
        document.body.appendChild(script);
    }
};
Template.pickAddress.events({
    'click #create': function(event, template){
        event.preventDefault();
        Hembu.methods.address.create(Template.pickAddress.address, function(err, result){
            if(err){
                console.log(err)
            }   
            else{
                Router.go('home');
            }
        });
    },
    'click #join': function(event, template){
        event.preventDefault();
        Hembu.methods.address.join(Template.pickAddress.address, function(err, result){
            if(err){
                console.log(err)
            }   
            else{
                Router.go('home');
            }
        });
    }
});
