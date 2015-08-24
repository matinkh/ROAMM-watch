var tempx=0,tempy=0,tempz=0,
count = 0;
var accelArray = [];

/*
 * Matin
 * July 10th 2015
 * According to our meeting today, it is found better to keep root-mean-squared values for each axis, instead of averaging their values.
 * Thus three arrays are put here to keep track of the values during each second, and by the end of the second, these values are used to calculate RMS.
 * xArray, yArray, zArray.
 */
var xArray = [];
var yArray = [];
var zArray = [];
var xRMS = 0, yRMS = 0, zRMS = 0;

function startAccel() {
		
	var handleAccelData = function(x, y, z){
		//document.getElementById("accel").innerHTML = (x+"").substring(0,4) + "," + (y+"").substring(0,4) + "," + (z+"").substring(0,4);
		//saveAccel([x, y, z]);
		count++;
		
		xArray.push(x);
		yArray.push(y);
		zArray.push(z);
		/*
		 * Matin
		 * The below code can be removed. But since we do not have a conrol version mechanism here, I keep them for now.
		 */
		
		// keep a running average of all the values retrieved by the sensor
		tempx = ((tempx*(count-1)) + x)/count;
		tempy = ((tempy*(count-1)) + y)/count;
		tempz = ((tempz*(count-1)) + z)/count;
		
		// trying to also buffer the data
		// have not had much success, cant efficiently then store all the values to the local storage
		accelArray.push({timestamp:new Date(),x:x,y:y,z:z});
		
	};
	
	window.addEventListener('devicemotion', function(e){
		handleAccelData(
				e.accelerationIncludingGravity.x,
				e.accelerationIncludingGravity.y,
				e.accelerationIncludingGravity.z
		);
	}, function(error) {
		console.log("[Matin] Error on DEVICE-MOTION: " + error);
	});
	
	var rate = 1000,
	// The rate set on the portal is in milliseconds
	store = localStorage.getItem("com.uf.agingproject.accelRate");
	if(store){
		rate = parseInt(store);
	}
	//TODO: [Epoch length] Change the following line
	var manualAccelRate = 60 * 1000;
	var interval = window.setInterval(function(){
		document.getElementById("accel").innerHTML = (tempx+"").substring(0,4) + "," + (tempy+"").substring(0,4) + "," + (tempz+"").substring(0,4);
		
		//console.log(accelArray);
		
		/*
		 * Matin
		 * So instead of the average values, RMS values are put into the local database.
			saveAccel([tempx, tempy, tempz]);
		*/
		calculateAxisRMS_clearArrays();
		//saveAccel([xRMS, yRMS, zRMS]);
		
		// clear buffer and reset values
		accelArray = [];
		
		tempx = 0;
		tempy = 0;
		tempz = 0;
		count = 0;
	}, manualAccelRate);
	
	sessionStorage.setItem("com.uf.agingproject.accelInterval", interval);
	
}

/**
 * Matin
 * July 10th 2015
 * RMS function calculates root mean squared values for each axis.
 */
function calculateAxisRMS_clearArrays() {
	var xSquaredVal = [];
	for (i = 0; i < xArray.length; i++) {
		xSquaredVal.push(xArray[i] * xArray[i]);
	}
	xRMS = Math.sqrt(calculateAverage(xSquaredVal));
	
	var ySquaredVal = [];
	for (i = 0; i < yArray.length; i++) { 
		ySquaredVal.push(yArray[i] * yArray[i]);
	}
	yRMS = Math.sqrt(calculateAverage(ySquaredVal));
	
	var zSquaredVal = [];
	for (i = 0; i < zArray.length; i++) { 
		zSquaredVal.push(zArray[i] * zArray[i]);
	}
	zRMS = Math.sqrt(calculateAverage(zSquaredVal));
	/*
	console.log("[Root-Mean-Squared] xArray: " + xArray.toString());
	console.log("[Root-Mean-Squared] xRMS: " + xRMS);
	console.log("[Root-Mean-Squared] yArray: " + yArray.toString());
	console.log("[Root-Mean-Squared] yRMS: " + yRMS);
	console.log("[Root-Mean-Squared] zArray: " + zArray.toString());
	console.log("[Root-Mean-Squared] zRMS: " + zRMS);
	*/
	xArray = [];
	yArray = [];
	zArray = [];
}

/**
 * Matin
 * July 10th 2015
 * Takes an array and returns the average.
 */
function calculateAverage(arr) {
	var sum = 0;
	for (i = 0; i < arr.length; i++)
		sum += arr[i];
	if(arr.length > 0)
		return sum/arr.length;
	return 0;
}
function stopAccel(){
	clearInterval(parseInt(sessionStorage.getItem("com.uf.agingproject.accelInterval")));
	document.getElementById("accel").innerHTML = "OFF";
	
	sessionStorage.removeItem("com.uf.agingproject.accelInterval");
}

// Working on a function to calibrate the watch to a flat surface
// Doesn't do anything just yet
function calibrateAccel(){
	var offsetX = 0 - tempx,
	offsetY = 0 - tempy,
	offsetZ = 9.8 - tempz;
	
	console.log("offsets: " + offsetX + "," + offsetY + "," + offsetZ);
}

