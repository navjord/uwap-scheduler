requirejs.config({
	shim: {
		'js/lib/underscore-min.js': {
			deps: ['js/lib/jquery-1.7.2.min.js'],
			exports: '_'
		},
		'js/lib/bootstrap-collapse.js': {
			deps: ['js/lib/bootstrap-transition.js', 'js/lib/bootstrap.min.js']
		},
		'js/lib/bootstrap-tab.js': {
			deps: ['js/lib/bootstrap.min.js']
		},
		'js/lib/bootstrap-transition.js' : {
			deps: ['js/lib/bootstrap.min.js']
		},
		'js/lib/bootstrap.min.js': {
			deps: ['js/lib/jquery-1.7.2.min.js']
		},
		'js/lib/dhtmlxscheduler.js' : {
			deps: [],
			exports: 'scheduler'
		},
		'js/lib/dhtmlxscheduler_timeline.js': {
			deps: ['js/lib/dhtmlxscheduler.js']
		},
		'js/lib/dhtmlxscheduler_treetimeline.js': {
			deps: ['js/lib/dhtmlxscheduler_timeline.js', 'js/lib/dhtmlxscheduler.js']
		},
		'js/lib/moment.min.js' : {
			deps: ['js/lib/jquery-1.7.2.min.js']
		},
		'js/lib/router.jquery.js': {
			deps: ['js/lib/jquery-1.7.2.min.js']
		},
		'/_/js/core.js': {
			deps: ['js/lib/jquery-1.7.2.min.js'],
			exports: 'UWAP'
		}

	}
});

require(['/_/js/core.js', 'js/lib/dhtmlxscheduler.js', 'js/lib/underscore-min.js', 'js/lib/router.jquery.js', 'js/lib/moment.min.js', 'js/lib/dhtmlxscheduler_treetimeline.js',
         'js/lib/dhtmlxscheduler_timeline.js', 'js/lib/bootstrap.min.js', 'js/lib/bootstrap-tab.js',
         'js/lib/bootstrap-collapse.js', 'js/lib/jquery-1.7.2.min.js'], 
         function(UWAP, scheduler, _ ){
//	console.log(UWAP);
//	console.log(scheduler);
//	console.log(_);

	var pubElements = new Array();
	var pubSectionAdd = '30';

	function addUninettUser(uName){


		UWAP.data.get('https://calendar.uninett.no/ics/uninett-'+uName+'.ics', null, function(d){
			var uNameSection = (pubElements.length+1)*10;
			console.log(uName+uNameSection);
			pubElements.push({key: uNameSection, label: uName});
			makeTimeLine();
			scheduler.attachEvent("onEventLoading", function(d){
				d.section_id = uNameSection;
				scheduler.addEvent(d);

			});
			scheduler.parse(d, 'ical');
		});

	}
//	Returns date  for a week number (starting with 1) and day number (monday is 0)(of current year)
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

		if(u.groups['@realm:uninett.no']){

			console.log('uninett in');

		}
		else{
			$('#uniaccord').hide();
		}


		$.router.addHandler('handleID', function(get){
			var tempGr = $.router.get('gr');
			console.log(tempGr);
			if(tempGr){
				getGroupCalendars(tempGr);
			}

		});

		pubElements[0].children.push({key: 11, label: u.name});
		UWAP.store.queryList({ "type": "cal"}, storeCalGotten, function(err){console.log(err);});

		scheduler.attachEvent("onEventSave", function(id, data, is_new_event){
			data.type = "cal";
			data.end = moment(data.end_date).format('YYYY-MM-DD HH:mm');
			data.start = moment(data.start_date).format('YYYY-MM-DD HH:mm');
			UWAP.store.save(data, function(){console.log('save successful'); console.log(data);}, function(err){console.log(err);});
			return true;
		});
	}
	function storeCalGotten(d){
		console.log(d);
		$.each(d, function(i,c){
			console.log(c);
			cend= moment(c.end, 'YYYY-MM-DD HH:mm');
			cstart= moment(c.start, 'YYYY-MM-DD HH:mm');
			c.end_date = new Date(cend.year(), cend.month(), cend.date(), cend.hours(), cend.minutes(), cend.seconds());
			c.start_date = new Date(cstart.year(), cstart.month(), cstart.date(), cstart.hours(), cstart.minutes(), cstart.seconds());

			scheduler.addEvent(c);
			makeTimeLine();
		});

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

		$('.dhx_scell_level10').bind('click', function(d){console.log('change:'); console.log(d);});
	}
	$("document").ready(function() {
		UWAP.auth.require(loggedIn);
		console.log(getDate(2,1));
		$('#icaladder').change(function(){
			addIcalFile($('#icaladder').prop('value'));
		});
		$('#gcalbutton').click(function(){
			UWAP.data.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', {handler: 'gCal'}, googleListGotten, prevError);
		});
		$('#remAll').click(function(){
			removeAllStored();
		});
		$('#userchooser').change(function(){
			addUninettUser(this.value);
		});
		
		scheduler.locale.labels.timeline_tab = "Timeline";
		scheduler.locale.labels.section_custom="Section";
		scheduler.config.details_on_create=true;
		scheduler.config.details_on_dblclick=true;
		scheduler.config.xml_date="%Y-%m-%d %H:%i";


		//===============
		//Configuration
		//===============	

		elements = [ // original hierarhical array to display
		             {key:20, label: "Kalendere", open: true, children: [ ]}
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
	});
	function groupListCallback(d){
		console.log('Group list: ');
		console.log(d);
		_.each(d, function(gr){
			$('select#groupselect').append('<option value="'+gr.id+'">'+gr.title+'</option>');
		});
	}
	function getGroupCalendars(gr){
		if(gr){
			console.log('getting calendars for group: '+gr);
			UWAP.groups.get(gr, function(d){console.log('group gotten:'); console.log(d); addUsersFromMail(d.members);}, function(err){ console.log(err);});
		}
		else{

		}
	}
	function addUsersFromMail(mailAdr){
		_.each(mailAdr, function(ma){
			var tempArr = ma.split('@');
			addUninettUser(tempArr[0]);
		});
	}
	function icalGotten(d){
		console.log(d);

		scheduler.parse(d, 'ical');
	}

	function weatherCallback(d){
		console.log('weathercallback');
		console.log(d);
		var attr;
		var symbolNo;
		var tempInt = 0;
		_.each(d.product.time, function(pt){
			attr = pt["@attributes"];
			tempInt++;
			if(pt.location.symbol  && pt.location.symbolProbability){//}["@attributes"].value<2){
				tempInt =0;
				console.log('pt.location.symbol exists with pt.location.symbolProbability["@attributes"].value: '+pt.location.symbolProbability['@attributes'].value);
				symbolNo = pt.location.symbol["@attributes"].number;
				var fromMoment = moment(attr.from).format("YYYY-MM-DD HH:mm");
				var toMoment = moment(attr.to).format("YYYY-MM-DD HH:mm");

				if(moment(attr.to).diff(moment(attr.from), 'minutes') > 200 && moment(attr.to).diff(moment(attr.from), 'minutes') < 400){
					console.log(pubElements);
					scheduler.parse([{ start_date: fromMoment , end_date: toMoment , text: '<image height="16" width="16" src="http://api.met.no/weatherapi/weathericon/1.0/?symbol='+symbolNo+';content_type=image/png"></image>', section_id: 21}],'json');//'<iframe src="http://api.met.no/weatherapi/weathericon/1.0/?symbol='+symbolNo+';content_type=image/png"></iframe>' }]);
				}
			}
		});

	}
	function addIcalFile(icalFile){
		console.log('getting '+icalFile);
		UWAP.data.get(icalFile, {}, icalGotten);
	}
	function weatherFail(err){
		console.log(err);
	}
	function googleListGotten(d){
		console.log(d);
		$.each(d.items, function(i,l){
			console.log('getting '+'https://www.googleapis.com/calendar/v3/calendars/'+l.id+'/events');
			UWAP.data.get('https://www.googleapis.com/calendar/v3/calendars/'+l.id+'/events',{handler: 'gCal'}, googleDataGotten, prevError);
		});
	}
	function googleDataGotten(d){
		console.log('google data gotten:');
		console.log(d);
		$.each(d.items, function(i, c){
			c.start_date = moment(c.start.dateTime).format();
			c.end_date = moment(c.end.dateTime).format();
			if(c.end.date){
				c.end.dateTime=c.end.date;
				c.start.dateTime=c.start.date;
			}
			cend = moment(c.end.dateTime, "YYYY-MM-DDTHH:mm:ssZ");
			cstart = moment(c.start.dateTime, "YYYY-MM-DDTHH:mm:ssZ");
			c.end_date = new Date(cend.year(), cend.month(), cend.date(), cend.hours(), cend.minutes(), cend.seconds());
			c.start_date = new Date(cstart.year(), cstart.month(), cstart.date(), cstart.hours(), cstart.minutes(), cstart.seconds());

			if(c.summary){
				c.text=c.summary;
			}
			else{
				c.text = d.summary;
			}

			c.section_id = 11;
			scheduler.addEvent(c);
		});
	}
	function removeAllStored() {
		UWAP.store.remove({"type": "cal"}, function(){}, function(err){console.log(err);});
	}

	Date.prototype.getWeek = function() {
		var onejan = new Date(this.getFullYear(),0,1);
		return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
	};


});