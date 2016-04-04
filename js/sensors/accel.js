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
		document.getElementById("accel").innerHTML = (x+"").substring(0,4) + "," + (y+"").substring(0,4) + "," + (z+"").substring(0,4);
		count++;
		
		xArray.push(x);
		yArray.push(y);
		zArray.push(z);
		
		// trying to also buffer the data
		// have not had much success, cant efficiently then store all the values to the local storage
		// This is now being used for realtime frequency analysis
		//accelArray.push({timestamp:new Date(),x:x,y:y,z:z});
		
	};
	
	window.addEventListener('devicemotion', function(e){
		handleAccelData(
				e.accelerationIncludingGravity.x,
				e.accelerationIncludingGravity.y,
				e.accelerationIncludingGravity.z
		);
	}, function(error) {
		console.log("Error on DEVICE-MOTION: " + error);
	});
	
	var rate = 100,
	// The rate set on the web portal is in milliseconds
	store = localStorage.getItem("com.uf.agingproject.accelRate");
	if(store){
		rate = parseInt(store);
	}
	
	// Get RAW acceleration at 10Hz
	var interval = window.setInterval(function(){
		
		calculateAxisRMS_clearArrays();
		saveAccel([xRMS, yRMS, zRMS]);
		
		accelArray.push({timestamp:new Date(),x:xRMS,y:yRMS,z:zRMS});
		
		count = 0;
	}, rate);
	
	// perform DSP in real time every 15 seconds
	var fftInterval = window.setInterval(function(){
		var tempData = accelArray.slice();
		accelArray = [];
		
		// to analysisManager
		var features = processData(tempData);
		
		addFeatureItemToDB(features);
		
	}, SMALL_WINDOW_INTERVAL);
	
	
	// Average features computed over 15 minute interval and save to main DB
	var featureInterval = window.setInterval(function(){
		
		fdb = getFeatureDatabase();
		
		var onsuccess = function(array){
			var avgFeatures = averageOverLargeWindow(array);
			
			var item = new Item();
			item.features = avgFeatures;
			
			addToDB(item);
			
			clearFeatureDB();
		},
		onerror = function(error){
			console.log(error);
		};
		
		fdb.getAll(onsuccess,onerror);
		
	}, LARGE_WINDOW_INTERVAL);
	
	sessionStorage.setItem("com.uf.agingproject.accelInterval", interval);
	sessionStorage.setItem("com.uf.agingproject.accelFftInterval", fftInterval);
	sessionStorage.setItem("com.uf.agingproject.featureInterval", featureInterval);
	
}

/**
 * Matin
 * July 10th 2015
 * RMS function calculates root mean squared values for each axis.
 */
function calculateAxisRMS_clearArrays() {
	var xSquaredVal = [];
	for (var i = 0; i < xArray.length; i++) {
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


/**
 * Sanjay
 * February 15th 2016
 * Returns array of vector magnitudes of input data array containing {x,y,z}
 */
function getVectorMagnitudes(data){
    var output = [];

    for(var i = 0; i <= data.length; i++){
        if(data[i]){
            output.push(Math.sqrt(Math.pow(data[i].x,2) + Math.pow(data[i].y,2) + Math.pow(data[i].z,2)))
        }
    }

    return output;
}

/**
 * Sanjay
 * February 15th 2016
 * Convert array of real values into complex array of complex values
*/
function generateComplexArray(data){
	var output = new complex_array.ComplexArray(data.length);
    output.map(function(value, i, n) {
      value.real = data[i];
    });
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

