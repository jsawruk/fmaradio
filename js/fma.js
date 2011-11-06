// FMA Radio main Javascript file
var fma = {};
fma.apiKey = "RVT1BNUNP3DUTKTLS";
fma.fmaKey = "FI74IUKFE2K60BMV";

fma.load = function() {
	fma.makeAccordion();
	//fma.initSoundManager();	

	fma.licenses = ["http://freemusicarchive.org/FMA_License",
	                "http://creativecommons.org/licenses/by/3.0/","http://creativecommons.org/licenses/by-sa/3.0/",
	                "http://creativecommons.org/licenses/by-nd/3.0/","http://creativecommons.org/licenses/by-nc/3.0/",
	                "http://creativecommons.org/licenses/by-nc-sa/3.0/",
	                "http://creativecommons.org/licenses/by-nc-sa/3.0/us/",
	                "http://creativecommons.org/licenses/by-nc-nd/3.0/"]
	
	$("#jquery_jplayer_1").jPlayer({
		  ready: function () {
		  },
		  loadstart: function() {
			  $(".jp-title .title").text("LOADING");
		  },
		  loadeddata: function() {
			  $(".jp-title .title").text(fma.playInfo);
		  },
		  ended: function() {
			  //console.log("ENDED");
			  if(fma.trackIndex < $("#playlist li").length) {
				  fma.trackIndex++;
				  fma.play($("#playlist li")[fma.trackIndex]);
			  }
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
	
	$("#clear-licenses").click(function(event) {
		event.preventDefault();
		$("#license-list input[type=checkbox]").each(function(index, item){
			$(item).removeAttr('checked');
		});
	});
	
	$("#all-licenses").click(function(event) {
		event.preventDefault();
		$("#license-list input[type=checkbox]").each(function(index, item){
			$(item).attr('checked', 'checked');
		});
	});
	
	$("#submit").click(function(event){
		fma.getPlaylist();
	});
	
	$("#artist").keypress(function(e){
		if(e.which == 13) {
			fma.getPlaylist();
	    }
	});
	
	$("#playlist").delegate('#playlist li', 'click', function(event){
		$(".jp-title .title").text("LOADING");
		
		fma.trackIndex = $(this).index();
		
		fma.play(this);
		
	});
};

fma.play = function(item) {
	
	// Get the id and parse
	var id = $(item).find(".meta").text();
	var index = id.indexOf("track:");
	var parsedId = id.substr(index + 6);

	fma.getTrack(parsedId, function(data){
		var playUrl = data.dataset[0].track_url + "/download";
		$("#jquery_jplayer_1").jPlayer("setMedia", {mp3: playUrl});
		$("#jquery_jplayer_1").jPlayer("play");
		
		fma.playInfo = data.dataset[0].artist_name + " - " + data.dataset[0].track_title;
		$(".jp-title .title").text(fma.playInfo);
		$(".jp-duration").text(data.dataset[0].track_duration);
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

	$("#search-status").text("Searching...");
	
	var styles = fma.getStyleSelected();
	var moods = fma.getMoodSelected();
	
	var licenses = fma.getLicenseSelected();
	
	var artist = $("#artist").val();
	
	if(artist !== "") {
		fma.searchByArtist(artist, styles, moods, licenses);
	}
	else {
		fma.searchByTerms(styles, moods, licenses);
	}
	
};

fma.searchByArtist = function(artist, styles, moods, licenses) {
	$.ajax({
		url: "http://developer.echonest.com/api/v4/playlist/static?bucket=tracks",
		data:{
			api_key: fma.apiKey,
			artist:	artist,
			mood: moods,
			style: styles,
			type: 'artist-radio',
			bucket: 'id:fma',
			limit: 'true',
			results: 20
		},
		success: function(data) {
			fma.buildPlaylist(data, licenses);
		}
	});
};


fma.searchByTerms = function(styles, moods, licenses) {
	$.ajax({
		url: "http://developer.echonest.com/api/v4/playlist/static?bucket=tracks",
		data:{
			api_key: fma.apiKey,
			mood: moods,
			style: styles,
			type: 'artist-description',
			bucket: 'id:fma',
			limit: 'true',
			results: 20
		},
		success: function(data) {
			fma.buildPlaylist(data, licenses);
		}
	});
};

fma.buildPlaylist = function(data, licenses) {
	
	$("#playlist").empty();
	$.each(data.response.songs, function(index, item) {
		var id = item.tracks[0].foreign_id;
		var index = id.indexOf("track:");
		var parsedId = id.substr(index + 6);
		
		fma.getTrack(parsedId, function(data){
			
			var license = data.dataset[0].license_url;
			var licenseTitle = data.dataset[0].license_title;
			var licenseIndex = $.inArray(license, licenses);
			//console.log(license);
			//console.log(licenseTitle);
			
			if(licenseIndex != -1) {
				// Only add matching licenses
				var listItem = $('<li class="item"></li>');
				listItem.append('<div class="left">' + item.artist_name + '/' + item.title + '</div>');
				listItem.append('<div class="right"><img src="images/' + licenseTitle + '.png"/></div>');
				listItem.append('<div class="meta">' + item.tracks[0].foreign_id + '</div>');
				$("#playlist").append(listItem);
			}
		}); // end .getTrack callback
		
	}); // end $.each song
	
	$("#search-status").text("");
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

/*
fma.play = function(url) {
	//var audioElement = document.getElementById('player');
	//audioElement.setAttribute('src', url);
	//audioElement.play();
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
}; */

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

fma.getLicenseSelected = function() {
	var name = [];
	$("#license-list input[type=checkbox]:checked").each(function(index, item){
		var licenseIndex = $('#license-list input[type=checkbox]').index(item);
		name.push(fma.licenses[licenseIndex]);
	});
	return name;
}