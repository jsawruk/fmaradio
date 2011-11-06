// FMA Radio main Javascript file
var fma = {};
fma.apiKey = "RVT1BNUNP3DUTKTLS";
fma.fmaKey = "FI74IUKFE2K60BMV";

fma.load = function() {
	fma.makeAccordion();
	//fma.initSoundManager();	
	
	$("#jquery_jplayer_1").jPlayer({
		  ready: function () {
		  },
		  loadstart: function() {
			  $(".jp-title .title").text("LOADING");
		  },
		  loadeddata: function() {
			  $(".jp-title .title").text(fma.playInfo);
		  },
		  swfPath: "/js"
	});
	
	$("#submit").button();
	
	$("#clear-styles").click(function(event) {
		event.preventDefault();
		$("#style-list input[type=checkbox]").each(function(index, item){
			$(item).removeAttr('checked');
		});
	});
	
	$("#clear-moods").click(function(event) {
		event.preventDefault();
		$("#mood-list input[type=checkbox]").each(function(index, item){
			$(item).removeAttr('checked');
		});
	});
	
	$("#submit").click(function(event){
		fma.getPlaylist();
	});
	
	$("#playlist").delegate('#playlist li', 'click', function(event){
		// Get the id and parse
		var id = $(this).find(".meta").text();
		var index = id.indexOf("track:");
		var parsedId = id.substr(index + 6);
		
		console.log(parsedId);

		fma.getTrack(parsedId, function(data){
			console.log(data);
			var playUrl = data.dataset[0].track_url + "/download";
			console.log(playUrl);
			//fma.play(playUrl);
			$("#jquery_jplayer_1").jPlayer("setMedia", {mp3: playUrl});
			$("#jquery_jplayer_1").jPlayer("play");
			
			fma.playInfo = data.dataset[0].artist_name + " - " + data.dataset[0].track_title;
			$(".jp-title .title").text(fma.playInfo);
			$(".jp-duration").text(data.dataset[0].track_duration);
		});
		
	});
};

fma.getTrack = function(id, callback) {
	$.ajax({
		url: "http://freemusicarchive.org/api/get/tracks.jsonp",
		data: {
			api_key: fma.fmaKey,
			track_id: id
		},
		dataType: 'jsonp',
		success: function(data) {
			callback(data);
		}
	});
}

fma.getPlaylist = function() {

	var styleString = fma.getStyleSelected();
	var moodString = fma.getMoodSelected();
	
	var artist = $("#artist").val();
	
	$.ajax({
		url: "http://developer.echonest.com/api/v4/playlist/static?bucket=tracks",
		data:{
			api_key: fma.apiKey,
			artist:	artist,
			mood: moodString,
			style: styleString,
			type: 'artist-radio',
			bucket: 'id:fma',
			limit: 'true',
			results: 50
		},
		success: function(data) {
			//console.log(data);
			$("#playlist").empty();
			$.each(data.response.songs, function(index, item){
				//console.log(item);
				var listItem = $('<li class="item"></li>');
				listItem.append('<div class="left">' + item.artist_name + '/' + item.title + '</div>');
				listItem.append('<div class="meta">' + item.tracks[0].foreign_id + '</div>');
				$("#playlist").append(listItem);
			});
		}
	});
};

fma.makeAccordion = function() {
	$("#accordion").accordion();

	$.ajax({
		url: 'http://developer.echonest.com/api/v4/artist/list_terms',
		data: {
			api_key: fma.apiKey,
			type: 'style'
		},
		success: function(data) {
			
			$.each(data.response.terms, function(index, item){
				$("#style-list").append('<div class="row"><label>' + item.name + '</label><input type="checkbox" /></div>');
			});
			
			$("#accordion").accordion('resize');
		}
	});
	
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/artist/list_terms',
		data: {
			api_key: fma.apiKey,
			type: 'mood'
		},
		success: function(data) {
			console.log(data);
			$.each(data.response.terms, function(index, item){
				$("#mood-list").append('<div class="row"><label>' + item.name + '</label><input type="checkbox" /></div>');
			});
			
			$("#accordion").accordion('resize');
		}
	});
};

fma.initSoundManager = function() {
	window.soundManager = new SoundManager(); // Flash expects window.soundManager.
	
	soundManager.url = '/swf';
	soundManager.waitForWindowLoad = false;
	
	soundManager.flashVersion = 9;
	soundManager.useFlashBlock = false;
	soundManager.useMovieStar = true;	// MP4 support
	soundManager.useHTML5Audio = true;	// Use HTML5 if available and codec supported

	soundManager.flash9Options = { isMovieStar: true };
	
	soundManager.debugMode = false;
	soundManager.debugFlash = false;
	
	soundManager.beginDelayedInit(); // start SM2 init.
	
	soundManager.onready(function() {
	});

};

fma.play = function(url) {
	//var audioElement = document.getElementById('player');
	//audioElement.setAttribute('src', url);
	//audioElement.play();
	/*
	// Create SoundManager sound
	soundManager.destroySound('mySound');
	
	soundManager.createSound({
		 id: 'mySound', // required
		 url: url, // required,
		 autoPlay: false,
		 autoLoad:false,
		 stream:false,

		 onconnect:function(connected) {
		 },
		 
		 onresume:function() {
		 },
		 
		 onid3: function() {
		 },
		 
		 onplay: function() {
		 },
		 
		 ondataerror: function() {
		 },
		 
		 onload: function(success) {
		 },
		 
		 onbufferchange:function() {
		 },
		 
		 whileloading:function() {
		 },
		 
		 // optional sound parameters here, see Sound Properties for full list
		 whileplaying: function() {
		 },
		 
		 onfinish: function() {
		 }
		}).play();
		*/
};

fma.getMoodSelected = function() {
	var str = "";
	$("#mood-list input[type=checkbox]:checked").each(function(index, item){
		str += $(item).siblings("label").text() + ',';
	});

	str = str.substring(0,str.length-1);
	return str;
};


fma.getStyleSelected = function() {
	var str = "";
	$("#style-list input[type=checkbox]:checked").each(function(index, item){
		str += $(item).siblings("label").text() + ',';
	});

	str = str.substring(0,str.length-1);

	return str;
}