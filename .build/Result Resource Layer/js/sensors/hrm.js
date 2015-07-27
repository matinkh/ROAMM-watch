function startHeartrate() {
	//console.log(interval);
	function onchangedCB(hrmInfo){
		if(hrmInfo.heartRate > 0){
			console.log("heartrate: " + hrmInfo.heartRate);
			document.getElementById("heartrate").innerHTML = hrmInfo.heartRate + "bpm";
			saveHeartrate(hrmInfo.heartRate);
			//hrmInfo.rRInterval
		}
		else{
			//console.log("no HR data acquired")
			document.getElementById("heartrate").innerHTML = "N/A";
			//saveHeartrate("N/A");
		}
	}
	
	// hrm active for 30 seconds to get a reading
	function startHR(){
		console.log("start HR monitor");
		window.webapis.motion.start("HRM", onchangedCB);
		
		$("#hrmActive").css("background","green");
		
		setTimeout(function(){
			console.log("stop HR monitor");
			window.webapis.motion.stop("HRM");
			$("#hrmActive").css("background","yellow");
			clearHeartrate();
		}, 30000);
	}
	
	var rate = 60;
	// The rate set on the portal is in seconds
	var store = localStorage.getItem("com.uf.agingproject.heartrateRate");
	if(store){
		rate = parseInt(store);
	}

	if(localStorage.getItem("com.uf.agingproject.heartrateContinuous") == "true"){
		console.log("start HR monitor CONTINUOUS");
		window.webapis.motion.start("HRM", onchangedCB);
		
		$("#hrmActive").css("background","green");
	}
	else{
		var interval = window.setInterval(function(){
			startHR();
		}, rate*1000);
		
		console.log("HRM polling at " + rate*1000 + " milliseconds");
		
		document.getElementById("heartrate").innerHTML = "N/A";
		sessionStorage.setItem("com.uf.agingproject.heartrateInterval", interval);
		$("#hrmActive").css("background","red");
	}

};

function stopHeartrate(){
	clearInterval(parseInt(sessionStorage.getItem("com.uf.agingproject.heartrateInterval")));
	document.getElementById("heartrate").innerHTML = "OFF";
	
	sessionStorage.removeItem("com.uf.agingproject.heartrateInterval");
}
