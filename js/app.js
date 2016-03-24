// ENTRY POINT OF THE APPLICATION
$(document).ready(function(){
	
	// Setting Watch ID
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
	
	// tap the screen to send local data
	$('.ui-page').on("click", function(){
		console.log("sending local data to remote server");
		batchSendLocalData11();
	});

	// get a reference to the IDB database that holds all permanent local data
	console.log("Local DB is being created");
	createDBUsingWrapper();

	// retrieves the config file from the server and starts all sensors
	console.log("Starting Sensors");
	startSensors();

	var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

	// Check if its night time or charging every hour. If so, automatically begin data export
	window.setInterval(function(){
		var now = new Date();
		if(battery.charging){
			batchSendLocalData11();
		}
		else if(battery.level > 0.50 && (now.getHours() > 22 || now.getHours() < 8)){
			batchSendLocalData11();
		}
	},3600000);
	
	// need this so app runs it the background interrupted
	tizen.power.request("CPU", "CPU_AWAKE");
	
	// sanity check to make sure no crashes in between
	console.log("made it to the end!");

});
