// This file has a bunch of outdated code. 
// Exporting data went through a LOT of changes but batchSendLocalData11 is the method currently being used

// NOT USED ANYMORE
function sendLocalData(){

	console.log("Exporting local data");

	var data = localStorage.getItem("com.uf.agingproject.data"),
	stage = localStorage.getItem("com.uf.agingproject.stage");

	if(!data){
		alert("no new data to send");
		return;
	}

	localStorage.removeItem("com.uf.agingproject.data");

	var url = "https://cise.ufl.edu/~snair/consumedata.php"

		if(stage){

			var dataArray = JSON.parse(data),
			stageArray = JSON.parse(stage),
			item;

			for(item in dataArray){
				stageArray.push(dataArray[item]);
			}

			stage = JSON.stringify(stageArray);
		}
		else{
			stage = data;
		}

	localStorage.setItem("com.uf.agingproject.stage", stage);



	//console.log(stage);

	if(stage){
		/*
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			beforeSend: function() {

			},
			success: function(data) {
				console.log("Data: " + data + "\nStatus: " + status);
				//alert("Data: " + data);
				archiveData();

			},
			error: function(xhr) { // if error occured
				console.log("Error: " + xhr.statusText);
			},
			complete: function() {

			},
			dataType: 'json'
		});
		 */
		$("#status").css("background","yellow");


		$.post("https://cise.ufl.edu/~snair/consumedata.php",
				{
			data : stage
				},
				function(data,status){
					console.log("Data: " + data + "\nStatus: " + status);
					//alert("Data: " + data);
					if(status === "success"){
						//archiveData();
						localStorage.removeItem("com.uf.agingproject.stage");
						$("#status").css("background","green");
					}
				})
				.fail(function(res){
					console.log("Error: " + res.status);
					$("#status").css("background","red");
					//alert("Error: " + res.status);		
				});
	}
	else{
		console.log("no new data to send");
		alert("no new data to send");
	}
}

// NOT USED
function postData(data){
	$("#status").css("background","yellow");

	$.post("https://cise.ufl.edu/~snair/consumedata.php",
			{
		data : data
			},
			function(data,status){
				console.log("Data: " + data + "\nStatus: " + status);
				if(status === "success"){
					$("#status").css("background","green");
				}
			})
			.fail(function(res){
				console.log("Error: " + res.status);
				$("#status").css("background","red");
			});

}


// USED
var globalData;

function batchSendLocalData11(){
	var database = getDatabase();
	
	var onsuccess = function(array){
		globalData = array;
		clearDB();
		batchSendLocalData2();
	},
	
	onerror = function(error){
		console.log(error);
	};
	
	database.getAll(onsuccess, onerror);
}

// NOT USED
function batchSendLocalData1(){
	var data = JSON.parse(localStorage.getItem("com.uf.agingproject.data")),
	stage = JSON.parse(localStorage.getItem("com.uf.agingproject.stage"));
	
	localStorage.removeItem("com.uf.agingproject.data");
	
	if(stage){
		for(item in data){
			stage.push(data[item]);
		}
		
	}
	else{
		stage = data;
	}
	
	localStorage.setItem("com.uf.agingproject.stage",JSON.stringify(stage));
	
	globalData = stage;
	batchSendLocalData2();
	
	localStorage.removeItem("com.uf.agingproject.stage");
}

// USED, recursive helper function to send 150 items at a time via HTTP POST
function batchSendLocalData2() {

	if (globalData.length === 0){
		console.log("Data export complete");
		return;
	}

	// pop top 150 values
	var sendingArray = [];

	while(sendingArray.length < 150 && globalData.length > 0){
		sendingArray.push(globalData[0]);
		globalData.shift();
	}
	
	$("#status").css("background","yellow");
	
	console.log(sendingArray);

	$.post("https://cise.ufl.edu/~snair/consumedata.php",
			{
		data : JSON.stringify(sendingArray)
			}, 
			function(data, status){
				console.log("Data: " + data + "\nStatus: " + status);
				$("#status").css("background","green");
				batchSendLocalData2();
			})
			.fail(function(data,status){
				console.log("Data: " + data + "\nStatus: " + status);
				$("#status").css("background","red");
				return;
			});
}

// NOT USED
function archiveData(){
	var data = JSON.parse(localStorage.getItem("com.uf.agingproject.stage"));
	var archive = JSON.parse(localStorage.getItem("com.uf.agingproject.archive"));
	var num = 0;
	if(archive === null){
		console.log("creating local archive store");
		archive = [];
	}

	//moving items to archive
	console.log("moving stored items to archive");
	var item;
	for(item in data){
		archive.push(data[item]);
		num++;
	}
	localStorage.setItem("com.uf.agingproject.archive", JSON.stringify(archive));

	console.log(num + " items moved");

	// clearing local storage
	console.log("clearing local storage");
	localStorage.removeItem("com.uf.agingproject.stage");
}

//debug for testing HTTP POST's
/*
function testSendLocalData(){

	console.log("Click!");
	var steps = document.getElementById("steps").innerHTML,
	heartrate = document.getElementById("heartrate").innerHTML,
	loc = document.getElementById("coordinates").innerHTML,
	pressure = document.getElementById("pressure").innerHTML,
	accel = document.getElementById("accel").innerHTML,
	uv = document.getElementById("uv").innerHTML,
	timestamp = Date();

	console.log("sending info: " + steps + ", " + loc + ", " + accel + ", " +  heartrate + ", " + uv  + ", " + pressure);

	$.post("https://cise.ufl.edu/~snair/test.php",
			{
		steps: steps,
		coordinates: loc,
		accel: accel,
		heartrate: heartrate,
		uv: uv,
		pressure: pressure,
		timestamp: timestamp
			},
			function(data,status){
				alert("Data: " + data);
				console.log("Data: " + data + "\nStatus: " + status);
			});

}
 */