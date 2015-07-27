function startSensors(){
	console.log("[MATIN] sensors started...");
	// get the config file
	$.getJSON("https://cise.ufl.edu/~snair/getConfig.php", function(json){
		console.log("Got settings");
		storeConfig(json);
		console.log(json);
		
		// set each value to its own slot in localstorage to be retrieved later
		localStorage.setItem("com.uf.agingproject.exportRate", json.export_rate);
		localStorage.setItem("com.uf.agingproject.accelRate", json.accel_rate);
		localStorage.setItem("com.uf.agingproject.gyroRate", json.gyro_rate);
		localStorage.setItem("com.uf.agingproject.pedoRate", json.pedo_rate);
		localStorage.setItem("com.uf.agingproject.heartrateRate", json.heartrate_rate);
		localStorage.setItem("com.uf.agingproject.locationRate", json.location_rate);
		localStorage.setItem("com.uf.agingproject.uvRate", json.uv_rate);
		localStorage.setItem("com.uf.agingproject.pressureRate", json.pressure_rate);
		localStorage.setItem("com.uf.agingproject.batteryRate", json.battery_rate);
		localStorage.setItem("com.uf.agingproject.heartrateContinuous", json.heartrate_continuous);
		localStorage.setItem("com.uf.agingproject.locationContinuous", json.location_continuous);

		
		// for each sensor, check if it is specified to be active and if so, start it
		// each start routine is defined in the respective sensor's js file
		
		if(json.accel_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.accelInterval")){
				startAccel();
			}
		}
		else{
			stopAccel();
		}

		if(json.gyro_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.gyroInterval")){
				startGyro();
			}
		}
		else{
			stopGyro();
		}

		if(json.pedo_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.pedoInterval")){
				startPedo();
			}
		}
		else{
			stopPedo();
		}

		if(json.heartrate_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.heartrateInterval")){
				startHeartrate();
			}
		}
		else{
			stopHeartrate();
		}

		if(json.location_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.gpsInterval")){
				startGPS();
			}
		}
		else{
			stopGPS();
		}


		if(json.battery_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.batteryInterval")){
				startBattery();
			}
		}
		else{
			stopBattery();
		}


		if(json.pressure_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.pressureInterval")){
				startPressure();
			}
		}
		else{
			stopPressure();
		}

		if(json.uv_active == "true"){
			if(!sessionStorage.getItem("com.uf.agingproject.uvInterval")){
				startUV();
			}
		}
		else{
			stopUV();
		}

		// calls sensorManager to start storing data items to permanent storage
		startLocalStorageInterval();

	});
}

// pretty sure this is unused
function getConfig(){
	$.getJSON("https://cise.ufl.edu/~snair/getConfig.php", function(json){
		console.log(json);
		storeConfig(json);

		setHeartrateInterval(json.heartrate_rate);

	});
}