Events = new Meteor.Collection("events");
Meteor.subscribe('events');

Template.calendar.rendered = function(){
    $('#calendar').fullCalendar({
        defaultView: 'agendaWeek',
        columnFormat: 'dd D',
        axisFormat: 'HH(:mm)',
        allDaySlot: false,
		editable: true,
		minTime: '06:00:00',
		aspectRatio: 0.6,
		windowResize: function(view) {
            if ($(window).width() < 601){
                $('#calendar').fullCalendar( 'changeView', 'agendaDay' );
            } else {
                $('#calendar').fullCalendar( 'changeView', 'agendaWeek' );
            }
        },
        events: function(start, end, timezone, callback) {
            var events = [];   
            Events.find({}).forEach(function (event) {
                events.push({
                    id: event._id,
                    title: event.title,
                    start: moment(event.start)
                });
            });
            console.log(events);
            callback(events);
        },
        dayClick: Template.calendar.addItem
    });
};
Template.calendar.Items = function(start, end, timezone, callback){
    return Events.find({}).fetch();
};
Template.calendar.addItem = function(date, event, view) { 
     Meteor.call('addEvent', {
                    start: date.format()
                }, function(error, comment){
                    if(!error){
                        $('#calendar').fullCalendar('refetchEvents');
                    }
                    else{
                        // TODO error hadling
                    }
                });      
};