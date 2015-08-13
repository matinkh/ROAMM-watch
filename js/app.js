// ENTRY POINT OF THE APPLICATION
$(document).ready(function(){
	
	// Make it so swiping down from the top closes the app
	document.addEventListener('tizenhwkey', function(e) {
		if(e.keyName == "back"){
			tizen.application.getCurrentApplication().exit();
		}
	});

	console.log("[MATIN] ROAMM project started.");
	
	// tap the screen to send local data
	$('.ui-page').on("click", function(){
		console.log("sending local data to remote server");
		batchSendLocalData11();
	//these are old versions of the export protocol
		//batchSendLocalData1();
		//sendLocalData();
		//alert("Request Completed");
	});

	// get a reference to the IDB database that holds all permanent local data
	console.log("[MATIN] Local DB is being created.");
	createDBUsingWrapper();

	// retrieves the config file from the server and starts all sensors
	console.log("[MATIN] Requesting sensors to start.");
	startSensors();

	/*
	window.setInterval(function(){
		startSensors();
	}, 30000);
	 */

	$("button").click(function(){

	});

	//while(!localStorage.getItem("com.uf.agingproject.exportRate")){}


	/*
	console.log("Setting automatic export interval");

	window.setInternal(function(){
		console.log("30 mins: sending local data to remote server");
		sendLocalData();
	}, parseInt(localStorage.getItem("com.uf.agingproject.exportRate")) * 60000);

	if(localStorage.getItem("com.uf.agingproject.data")){
		$("#status").css("background","orange");
	}
	else{
		$("#status").css("background","green");
	}
	*/

	var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

	// Check if its night time every hour. If so, automatically begin data export
	window.setInterval(function(){
		var now = new Date();
		if(battery.charging){
			//batchSendLocalData1();
			batchSendLocalData11();
		}
		else if(battery.level > 0.50 && (now.getHours() > 22 || now.getHours() < 8)){
			//batchSendLocalData1();
			batchSendLocalData11();
		}
	},3600000);
	
	// need this so app runs it the background interrupted
	tizen.power.request("CPU", "CPU_AWAKE");
	
	// sanity check to make sure no javascript crashed in between
	console.log("made it to the end!");

});
