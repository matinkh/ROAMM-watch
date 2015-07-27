var tempx=0,tempy=0,tempz=0,
count = 0;
var accelArray = [];

function startAccel() {
		
	var handleAccelData = function(x, y, z){
		//document.getElementById("accel").innerHTML = (x+"").substring(0,4) + "," + (y+"").substring(0,4) + "," + (z+"").substring(0,4);
		//saveAccel([x, y, z]);
		count++;
		
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
	});
	
	var rate = 1000,
	// The rate set on the portal is in milliseconds
	store = localStorage.getItem("com.uf.agingproject.accelRate");
	if(store){
		rate = parseInt(store);
	}

	var interval = window.setInterval(function(){
		document.getElementById("accel").innerHTML = (tempx+"").substring(0,4) + "," + (tempy+"").substring(0,4) + "," + (tempz+"").substring(0,4);
		
		//console.log(accelArray);
		
		saveAccel([tempx, tempy, tempz]);
		
		// clear buffer and reset values
		accelArray = [];
		
		tempx = 0;
		tempy = 0;
		tempz = 0;
		count = 0;
	}, rate);
	
	sessionStorage.setItem("com.uf.agingproject.accelInterval", interval);
	
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

