var RAW_MODE = false;

function startSensors(){
	console.log("Getting sensor configuration");
	
	// get the config file
	$.getJSON(URL_GET_CONFIG, function(json){
		console.log("Got config");
		storeConfig(json);
		console.log(json);
		
		// set each value to its own slot in localstorage to be retrieved later
		localStorage.setItem("com.uf.agingproject.exportRate", json.export_rate);
		localStorage.setItem("com.uf.agingproject.accelRate", json.accel_rate);
		localStorage.setItem("com.uf.agingproject.gyroRate", json.gyro_rate);
		localStorage.setItem("com.uf.agingproject.heartrateRate", json.heartrate_rate);
		localStorage.setItem("com.uf.agingproject.locationRate", json.location_rate);
		localStorage.setItem("com.uf.agingproject.batteryRate", json.battery_rate);
		localStorage.setItem("com.uf.agingproject.heartrateContinuous", json.heartrate_continuous);
		localStorage.setItem("com.uf.agingproject.locationContinuous", json.location_continuous);
		
		console.log("Starting sensors");
		
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

		
		// calls sensorManager to start storing data items to permanent storage
		if(RAW_MODE){
			startLocalStorageInterval();
		}

	});
}