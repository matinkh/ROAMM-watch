onmessage = function(e){
	startBattery();
}

function startBattery() {
	
	var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
	document.getElementById("battery").innerHTML = (battery.level * 100) + '%';
	saveBattery(battery.level * 100);
	
	var rate = 30000;
	var store = localStorage.getItem("com.uf.agingproject.batteryRate");
	if(store){
		rate = parseInt(store)*1000;
	}

	var interval = window.setInterval(function(){
		console.log("update battery info");
		var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
		document.getElementById("battery").innerHTML = (battery.level * 100) + '%';
		saveBattery(battery.level * 100);
	},rate);
	
	sessionStorage.setItem("com.uf.agingproject.batteryInterval", interval);
	
}

function stopBattery(){
	clearInterval(parseInt(sessionStorage.getItem("com.uf.agingproject.batteryInterval")));
	document.getElementById("battery").innerHTML = "OFF";
	
	sessionStorage.removeItem("com.uf.agingproject.batteryInterval");
}