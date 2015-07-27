var rate;
var GPSLock = false;
var count;
var gpsInterval;


//Handler if coordinates are acquired
function gotCoords(position){
	console.log("Got coordinates!");
	GPSLock = true;
	if(position.coords){
		var lat = sessionStorage.getItem("com.uf.agingproject.locLat")
		,lon = sessionStorage.getItem("com.uf.agingproject.locLat");

		if(position.coords.latitude !== lat && position.coords.longitude !== lon){
			console.log("location changed " + position.coords.latitude + "," + position.coords.longitude);
			document.getElementById('coordinates').innerHTML = (position.coords.latitude+"").substring(0,6) + "," + (position.coords.longitude+"").substring(0,6);
			saveCoordinates([position.coords.latitude, position.coords.longitude]);
			count++;
			//document.getElementById('coordinates').innerHTML = (position.coords.latitude+"").substring(0,5) + "," + (position.coords.longitude+"").substring(0,5);
		}
	}
}

//Handler if no coordinates acquired
function noCoords(reason){
	GPSLock = false;
	//document.getElementById('coordinates').innerHTML = "N/A";
	//clearCoordinates();
	console.log(reason);
}

//Get continuous GPS lock
function runGPS() {
	console.log("start GPS");
	if(navigator.geolocation) {
		count = 0;
		gpsInterval = navigator.geolocation.watchPosition(
				gotCoords, 
				noCoords
		);
	}
}

//Get single GPS location
function getLoc(){
	console.log("Acquiring GPS");
	count = 0;

	var options = {enableHighAccuracy: false,timeout: 5000,maximumAge: 0,desiredAccuracy: 0, frequency: 1 };
	gpsInterval = navigator.geolocation.watchPosition(gotCoords, noCoords, options);

}

function getLoc2(){
	console.log("Acquiring GPS");
	count = 0;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(gotCoords, noCoords, 
				{maximumAge: 60000, timeout:90000});
	} 
	else {
		console.log("Geolocation is not supported.");
	}
}

function haltGPS(){
	console.log("stop GPS");
	navigator.geolocation.clearWatch(gpsInterval);
	GPSLock = false;
	count = 0;
}

function stopGPS(){
	navigator.geolocation.clearWatch(gpsInterval);
	document.getElementById("coordinates").innerHTML = "OFF";

	sessionStorage.removeItem("com.uf.agingproject.gpsInterval");
	GPSLock = false;
}

function startGPS(){
	if(localStorage.getItem("com.uf.agingproject.locationContinuous") === "true"){
		console.log("GPS set to continuous");
		runGPS();
	}
	else{
		rate = parseInt(localStorage.getItem("com.uf.agingproject.locationRate")) * 1000;
		console.log("GPS polling at " + rate + " milliseconds");
		var interval = window.setInterval(function(){
			getLoc();
			setTimeout(function(){
				haltGPS();
			},90000);
		},rate);

		sessionStorage.setItem("com.uf.agingproject.gpsInterval", interval);
	}
}