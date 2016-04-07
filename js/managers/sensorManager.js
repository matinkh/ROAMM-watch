/**
 * sensorManager.js
 * 
 * Module responsible for configuring, starting, and stopping
 * physical sensors on the device.
 */

var RAW_MODE = false;

function startSensors(){
	console.log("Getting sensor configuration");
	
	// Get the config file
	// TODO move this into a network manager module
	$.getJSON(URL_GET_CONFIG, function(json){
		console.log("Got config");
		storeConfig(json);
		console.log(json);
		
		// Set each value to its own slot in localstorage to be retrieved later
		// localStorage is nonvolatile, therefore on failure to get latest config, sensors will use last stored value
		localStorage.setItem("com.uf.agingproject.exportRate", json.export_rate);
		localStorage.setItem("com.uf.agingproject.accelRate", json.accel_rate);
		localStorage.setItem("com.uf.agingproject.gyroRate", json.gyro_rate);
		localStorage.setItem("com.uf.agingproject.heartrateRate", json.heartrate_rate);
		localStorage.setItem("com.uf.agingproject.locationRate", json.location_rate);
		localStorage.setItem("com.uf.agingproject.batteryRate", json.battery_rate);
		localStorage.setItem("com.uf.agingproject.heartrateContinuous", json.heartrate_continuous);
		localStorage.setItem("com.uf.agingproject.locationContinuous", json.location_continuous);
		
		console.log("Starting sensors");
		
		// For each sensor, check if it is specified to be active and if so, start it.
		// Each start routine is defined in the respective sensor's js file
		
		// Start accelerometer
		if(json.accel_active === true){
			// UNUSED: previous builds requested config multiple times
			// Needed this check to see if the sensor was already running
			// Currently, if statement will always resolve
			// Same of all other sensors
			if(!sessionStorage.getItem("com.uf.agingproject.accelInterval")){
				startAccel();
			}
		}
		else{
			stopAccel();
		}

		// Start gyroscope
		if(json.gyro_active === true){
			if(!sessionStorage.getItem("com.uf.agingproject.gyroInterval")){
				startGyro();
			}
		}
		else{
			stopGyro();
		}

		// Start heartrate monitor
		if(json.heartrate_active === true){
			if(!sessionStorage.getItem("com.uf.agingproject.heartrateInterval")){
				startHeartrate();
			}
		}
		else{
			stopHeartrate();
		}

		// Start GPS
		if(json.location_active === true){
			if(!sessionStorage.getItem("com.uf.agingproject.gpsInterval")){
				startGPS();
			}
		}
		else{
			stopGPS();
		}

		// Start battery monitoring
		if(json.battery_active === true){
			if(!sessionStorage.getItem("com.uf.agingproject.batteryInterval")){
				startBattery();
			}
		}
		else{
			stopBattery();
		}

		
		// Calls sensorManager to start storing data items to permanent storage
		if(RAW_MODE){
			startLocalStorageInterval();
		}

	});
}