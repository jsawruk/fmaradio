// FMA Radio main Javascript file
var fma = {};
fma.apiKey = "RVT1BNUNP3DUTKTLS";

fma.load = function() {
	fma.getPlaylist();
};

fma.getPlaylist = function() {
	$.ajax({
		url: "http://developer.echonest.com/api/v4/playlist/dynamic",
		data:{
			api_key: 'N6E4NIOVYMTHNDM8J',
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