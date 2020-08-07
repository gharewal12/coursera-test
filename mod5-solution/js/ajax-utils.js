(function (global) {

	// Set up a namespace for our utility
	var ajaxutils = {};

	// Returns an HTTP request object

	function getRequestObject() {
		if (global.XMLHttpRequest) {
			return (new XMLHttpRequest());
		}
		else if (global.ActiveXObject) {
			// for very olf ir browsers
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		}
		else {
			global.alert("Ajax is not supported!");
			return(null);
		}
	}


	// Make an ajax get request to requesturl
	// main function

 	ajaxutils.sendgetrequest = function(requesturl,responsehandler) {
 		var request = getRequestObject();
 		request.onreadystatechange = 
 		function() {
 			handleresponse(request,responsehandler);
 		};


 		request.open("GET", requesturl, true); // true mean asynchronus
 		request.send(null); // for POST only

	};

	// only calls user provided 'responsehandler'
	// function if response is ready
	// and not an error

	function handleresponse(request,responsehandler){
		if ((request.readyState == 4) && (request.status == 200)) {
			responsehandler(request.responseText);
		}
	}

	// Expose utility to the global object
	global.$ajaxutils = ajaxutils;


})(window);