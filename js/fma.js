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
			artist:	'Yacht',
			type: 'artist-radio',
			bucket: 'id:fma'
		},
		success: function(data) {
			console.log(data);
		}
	});
}