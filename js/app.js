/*****************************************************
 * University of Florida
 * Institute on Aging
 * Data Science and Analytics Core
 * 
 * Real-time Online Activity and Mobility Monitoring
 *****************************************************/

/**
 * app.js
 * 
 * Entry point of the application.
 */
$(document).ready(function(){
	
	/*
	 * Setting the watchID.
	 * This value currently needs to be hard-coded into every watch instance.
	 * Used to differentiate records in the remote database.
	 */
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.watchID", WATCH_ID);
	}
	else {
		console.log("no sessionStorage in window");
	}
	
	// Make it so swiping down from the top closes the app
	document.addEventListener('tizenhwkey', function(e) {
		if(e.keyName == "back"){
			tizen.application.getCurrentApplication().exit();
		}
	});

	console.log("ROAMM app started.");
	
	// Tap the screen to save data stored in memory to a file
	// TODO make this a remote export call to the server
	$('.main').on("click", function(){
		console.log("saving local file data");
		saveRawAndFeatureDataToFile();
		alert("Saved");
	});

	// Get a reference to the IDB database that holds all permanent local data
	console.log("Local DB is being created");
	createDBUsingWrapper();
	
	console.log("Starting Sensors");
	
	// Retrieve the configuratin file from the server and starts all sensors
	startSensors();

	var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

	// Check if its night time or charging every hour. If so, automatically begin data export
	// TODO modify for transmitting only feature data
	window.setInterval(function(){
		var now = new Date();
		if(battery.charging){
			batchSendLocalData11();
		}
		else if(battery.level > 0.50 && (now.getHours() > 22 || now.getHours() < 8)){
			batchSendLocalData11();
		}
	},3600000);
	
	// Required to let the app run it the background without being suspended by the OS
	tizen.power.request("CPU", "CPU_AWAKE");
	
	// Sanity check to make sure nothing crashes in between
	console.log("made it to the end!");

});
