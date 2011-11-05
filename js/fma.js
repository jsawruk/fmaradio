// FMA Radio main Javascript file
var fma = {};
fma.apiKey = "RVT1BNUNP3DUTKTLS";

fma.load = function() {
	fma.getPlaylist();
	fma.makeAccordion();
};

fma.getPlaylist = function() {
	$.ajax({
		url: "http://developer.echonest.com/api/v4/playlist/dynamic",
		data:{
			api_key: fma.apiKey,
//			artist:	'Yacht',
			mood: 'happy',
			style: 'rock',
			type: 'artist-description',
			bucket: 'id:fma'
/*			dataType: 'jsonp',
			jsonp: 'callback',
            jsonpCallback: 'fma.jsonpCallback', */
		},
		success: function(data) {
			console.log(data);
		}
	});
};

fma.jsonpCallback = function(data){
    //$('#jsonpResult').text(data.message);
	console.log(data.message);
}

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
				$("#style-list").append(item.name + ' <input type="checkbox" /><br />')
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
				$("#mood-list").append(item.name + ' <input type="checkbox" /><br />')
			});
			
			$("#accordion").accordion('resize');
		}
	});

}