var pubElements = new Array();
var pubSectionAdd = '30';

function addUninettUser(uName){
	
	
	UWAP.data.get('https://calendar.uninett.no/ics/uninett-'+uName+'.ics', null, function(d){
		var uNameSection = (pubElements.length+1)*10;
		console.log(uName+uNameSection);
//		var uNameSection = (pubElements.length+1)*10;
		pubElements.push({key: uNameSection, label: uName});
		makeTimeLine();
//		scheduler.attachEvent("onEventAdded", function(event_id,event_object){
//	        //any custom logic here
//			console.log('event added: '+event_object);
//		});
//		scheduler.attachEvent("onXLE", function(){
//	        //any custom logic here
//			console.log('XLE added: ');
//		});
		scheduler.attachEvent("onEventLoading", function(d){
	        //any custom logic here
			d.section_id = uNameSection;
//			console.log('onEventLoading:');
//			console.log(d);
			scheduler.addEvent(d);
			
		});
//		scheduler.detachEvent("onEventLoading");
		scheduler.parse(d, 'ical');
	});
	
}
//Returns date  for a week number (starting with 1) and day number (monday is 0)(of current year)
function getDate(weekNo, dayNo){
	var today = new Date();
	var onejan = new Date(today.getFullYear(),0,1);
	if(moment(onejan).day() ==0){
		weekNo--;
	}
	return moment(new Date(today.getFullYear(),0,1)).add('weeks', weekNo-1).add('days', dayNo+1).subtract('days', moment(new Date(today.getFullYear(),0,1)).day());	
}
function loggedIn(u){
	
	UWAP.groups.listMyGroups(groupListCallback, prevError);
	if($.inArray('@realm:uninett.no', u.groups)>-1){
		
		console.log('uninett in');
	}
}

function prevError(err){
	console.log(err);
}

function makeTimeLine(){
	scheduler.createTimelineView({
		section_autoheight: false,
		name:	"timeline",
		x_unit:	"minute",
		x_date:	"%H:%i",
		x_step:	30,
		x_size: 24,
		x_start: 16,
		x_length:	48,
		y_unit: pubElements,
		y_property:	"section_id",
		render: "tree",
		folder_dy:20,
		dy:60
	});
	
	
	

	//===============
	//Data loading
	//===============
	scheduler.config.lightbox.sections=[	
		{name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
		{name:"custom", height:23, type:"timeline", options:null , map_to:"section_id" }, //type should be the same as name of the tab
		{name:"time", height:72, type:"time", map_to:"auto"}
	];
	
//	scheduler.init('scheduler_here',new Date(),"timeline");
//	console.log('scheduler inited');
	$('.dhx_scell_level10').bind('click', function(d){console.log('change:'); console.log(d);});
}
$("document").ready(function() {
	UWAP.auth.require(loggedIn);
	//UWAP.data.get('http://www.ime.ntnu.no/api/schedule/TEP4160/spring', {}, scheduleRetrieved);
	console.log(getDate(2,1));
//	UWAP.auth.require(loggedin);
	scheduler.locale.labels.timeline_tab = "Timeline";
	scheduler.locale.labels.section_custom="Section";
	scheduler.config.details_on_create=true;
	scheduler.config.details_on_dblclick=true;
	scheduler.config.xml_date="%Y-%m-%d %H:%i";
	
	
	//===============
	//Configuration
	//===============	
	
	elements = [ // original hierarhical array to display
//		{key:10, label:"Emner", open: true, children: []},
		{key:20, label: "V&aelig;rmelding", open: true, children: [
		{key:21, label: "<button id='weatherbutton' onclick=\"navigator.geolocation.getCurrentPosition(function(d){console.log(\'found location: \'+d.coords.latitude); UWAP.data.get(\'http://api.met.no/weatherapi/locationforecastlts/1.1/?lat=\'+d.coords.latitude+\';lon=\'+d.coords.longitude, {xml:\'1\'}, weatherCallback, weatherFail);}, function(err){console.log(\'error in finding location: \'+err)} );\">Hent v&aelig;rdata fra met.no</button>"} ]}
	];
	pubElements = elements;
	
	
	scheduler.createTimelineView({
		section_autoheight: false,
		name:	"timeline",
		x_unit:	"minute",
		x_date:	"%H:%i",
		x_step:	30,
		x_size: 24,
		x_start: 16,
		x_length:	48,
		y_unit: elements,
		y_property:	"section_id",
		render: "tree",
		folder_dy:20,
		dy:60
	});
	
	
	

	//===============
	//Data loading
	//===============
	scheduler.config.lightbox.sections=[	
		{name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
		{name:"custom", height:23, type:"timeline", options:null , map_to:"section_id" }, //type should be the same as name of the tab
		{name:"time", height:72, type:"time", map_to:"auto"}
	];
	
	scheduler.init('scheduler_here',new Date(),"timeline");
	makeTimeLine();
//	UWAP.data.get('https://calendar.uninett.no/davical/freebusy.php/anders.lund@uninett.no', null, icalGotten);
//	UWAP.data.get('https://calendar.uninett.no/davical/freebusy.php/andreas.solberg@uninett.no', null, icalGotten);
	

//	UWAP.data.get('https://calendar.uninett.no/ics/uninett-andreas.ics', null, icalGotten);
//	UWAP.data.get('https://calendar.uninett.no/ics/uninett-navjord.ics', null, icalGotten);
//	scheduler.load('https://calendar.uninett.no/ics/uninett-andreas.ics', 'ical');
//	getBuildingForRoom('EL5');
//	navigator.geolocation.getCurrentPosition(function(d){console.log('found location: '+d.coords.latitude); UWAP.data.get('http://api.met.no/weatherapi/locationforecast/1.8/?lat='+d.coords.latitude+';lon='+d.coords.longitude, {xml:'1'}, weatherCallback, weatherFail);}, function(err){console.log('error in finding location: '+err)} );
//	$.post("http://www.idi.ntnu.no/~tagore/cgi-bin/busstuc/busq.cgi", {quest: 'når går neste buss fra gløshaugen til dragvoll?', lang: 'nor'}, function(d){ console.log('answer from bussorakel: '+d);});
//	scheduler.parse(['BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-\nBEGIN:VFREEBUSY\nORGANIZER:MAILTO:jsmith@example.com\nDTSTART:20120313T141711Z\nDTEND:20120410T141711Z\nFREEBUSY:19980314T233000Z/19980315T003000Z\nFREEBUSY:19980316T153000Z/19980316T163000Z\nFREEBUSY:19980318T030000Z/19980318T040000Z\nURL:http://www.example.com/calendar/busytime/jsmith.ifb\nEND:VFREEBUSY\nEND:VCALENDAR'], 'ical');
//	UWAP.data.get('https://www.googleapis.com/calendar/v3/calendars/terje.navjord@gmail.com/events', {handler: "gTest"}, googleDataGotten, prevError);

//	UWAP.data.get('http://uninett.no', null, function(data) {
//
//		var webpage = $(data.data);
//		webpage.find("img").remove();
//		$("div#main").append(webpage.find("body").children());
//		console.log(webpage);
//
//		});
});
function groupListCallback(d){
	console.log('Group list: ');
	console.log(d);
	_.each(d, function(gr){
		$('select#groupselect').append('<option value="'+gr.id+'">'+gr.title+'</option>');
	});
}
function getGroupCalendars(gr){
	console.log('getting calendars for group: '+gr);
	UWAP.groups.get(gr, function(d){console.log('group gotten:'); console.log(d); addUsersFromMail(d.members);}, function(err){ console.log(err);});
}
function addUsersFromMail(mailAdr){
	_.each(mailAdr, function(ma){
		var tempArr = ma.split('@');
		addUninettUser(tempArr[0]);
	});
}
function icalGotten(d){
	console.log(d);
	
//	pubElements.push({key: (pubElements.length+1)*10, label: uName});
//	makeTimeLine();
//	scheduler.attachEvent("onEventAdded", function(event_id,event_object){
//        //any custom logic here
//		console.log('event added: '+event_object);
//	});
//	scheduler.attachEvent("onXLE", function(){
//        //any custom logic here
//		console.log('XLE added: ');
//	});
//	scheduler.attachEvent("onEventLoading", function(d){
//        //any custom logic here
//		d.section_id = pubSectionAdd;
//		console.log('onEventLoading:');
//		console.log(d);
//		scheduler.addEvent(d);
//	});
//	
	scheduler.parse(d, 'ical');
}

//function getBuildingForRoom(room){
//	 getElementFromHTML(room, 'hoyrebord', buildingCallback);
//}
//function getElementFromHTML(uri, element, callback){
//	UWAP.data.get('http://www.ntnu.no/studieinformasjon/rom/?sok=EL5&gr=1', null, buildingCallback);
////	UWAP.data.get(uri, null, callback);
//}
//function buildingCallback(d){
//	console.log(d);
//}

function weatherCallback(d){
	console.log('weathercallback');
	console.log(d);
	var attr;
	var symbolNo;
	var tempInt = 0;
	_.each(d.product.time, function(pt){
//		console.log(pt);
//		console.log('attributes:');
		attr = pt["@attributes"];
		tempInt++;
		if(pt.location.symbol  && pt.location.symbolProbability){//}["@attributes"].value<2){
			tempInt =0;
			console.log('pt.location.symbol exists with pt.location.symbolProbability["@attributes"].value: '+pt.location.symbolProbability['@attributes'].value);
			symbolNo = pt.location.symbol["@attributes"].number;
			var fromMoment = moment(attr.from).format("YYYY-MM-DD HH:mm");
			var toMoment = moment(attr.to).format("YYYY-MM-DD HH:mm");
			
			if(moment(attr.to).diff(moment(attr.from), 'minutes') > 200 && moment(attr.to).diff(moment(attr.from), 'minutes') < 400){
//				console.log(moment(fromMoment) + ' - '+ moment(toMoment));
//				console.log(fromMoment +' - ' +toMoment+' is mins apart: '+moment(attr.from).diff(moment(attr.to), 'minutes'));
				console.log(pubElements);
				scheduler.parse([{ start_date: fromMoment , end_date: toMoment , text: '<image height="16" width="16" src="http://api.met.no/weatherapi/weathericon/1.0/?symbol='+symbolNo+';content_type=image/png"></image>', section_id: 21}],'json');//'<iframe src="http://api.met.no/weatherapi/weathericon/1.0/?symbol='+symbolNo+';content_type=image/png"></iframe>' }]);
			}//makeTimeLine();
		}
	});
	
}
function addIcalFile(icalFile){
	UWAP.data.get(icalFile, {}, icalGotten);
}
function weatherFail(err){
	console.log(err);
}

function googleDataGotten(d){
	console.log('google data gotten:');
	console.log(d);
}

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};