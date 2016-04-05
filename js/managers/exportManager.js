// USED
var globalData;
var dataToFile;
var d;

function batchSendLocalData11(){
	try {
		console.log("[Matin] I GOT HERE! x0");
		var database = getDatabase();

		var onsuccess = function(array){
			// Matin
			console.log("[Matin] I GOT HERE! x1");
			dataToFile = array.slice();
			globalData = array;
			console.log("[Matin] I GOT HERE! x2");
			writeDataLocally();
			//batchSendLocalData_andClearStorageAfterwards();
			// Matin

			// Old send data. Worked for happy scenario only. Should be removed if the above code works.
			globalData = array;
			clearDB();
			batchSendLocalData2();
		},

		onerror = function(error){
			console.log(error);
		};

		database.getAll(onsuccess, onerror);
	} catch (exception) {
		console.log(exception.message);
	}
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

	$.post(URL_POST_DATA,
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

/**
 * This function depends on the <b>globalData</b> (which is filled with local database data), send <i>k = 150</i> rows to the server at a time. After sending every data, it clears the database.
 * @author matinkheirkhahan
 */
function batchSendLocalData_andClearStorageAfterwards() {

	console.log("[Matin] Sending data started...");
	kRows = 150;
	maxNoOfAttempts = 5;
	while(globalData.length > 0) {

		// pop top 150 values
		var sendingArray = [];

		while(sendingArray.length < kRows && globalData.length > 0){
			sendingArray.push(globalData[0]);
			globalData.shift();
		}
		console.log("[Matin] A package of " + kRows + " rows is being sent...");
		sendFlag = false;
		attemptsNo = 0;
		while(!sendFlag && attemptsNo < maxNoOfAttempts) {
			sendFlag = batchSendLocalData_kRowsAtATime(sendingArray);
			attemptsNo++;
		}
		if(!sendFlag) {
			console.log("[Matin] Some data could not be sent to the server in " + maxNoOfAttempts + " tries. Data should not be cleared.");
			return;
		}
	}
	console.log("Data export complete");
	clearDB();
}

/**
 * Gets an array (a portion of data obtained from local database) and sends them all to the server.
 * While sending the data, the sign is yellow. If everything goes correctly, the sign turns green, otherwise, it becomes red.
 * @returns true if everything is send to the server. Otherwise returns false.
 * @author matinkheirkhahan
 * @param kRowsData
 */
function batchSendLocalData_kRowsAtATime(kRowsData) {
	$("#status").css("background","yellow");

	console.log(kRowsData);

	$.post("https://cise.ufl.edu/~snair/consumedata.php",
			{
		data : JSON.stringify(kRowsData)
			}, 
			function(data, status){
				console.log("Data: " + data + "\nStatus: " + status);
				$("#status").css("background","green");
				return true;
			})
			.fail(function(data,status){
				console.log("Data: " + data + "\nStatus: " + status);
				$("#status").css("background","red");
				return false;
			});
}

/**
 * This function is called whenever the data is being sent to the server.<br>
 * It works with the global variable <b>dataToFile</b>. This function creates a "ROAMM" folder inside Documents and creates a .txt file containing current data.
 * @author matinkheirkhahan
 */
function writeDataLocally() {
	console.log("[Matin] writeDataLocally started...");
	var documentsDir;
	tizen.filesystem.resolve("documents", onDocumentResolve, function(error) {
		console.log("Could not resolve documents folder.");
		console.log(error);
	});

	function onDocumentResolve(result) {
		console.log("[Matin] documents folder resolved...");
		newFilePath = "ROAMM";
		documentsDir = result;
		tizen.filesystem.resolve("documents/" + newFilePath, onRoamResolve, function(error){
			console.log("[Matin] ROAMM folder could not be resolved. It should be created...");
			var newDir = documentsDir.createDirectory(newFilePath);
			console.log("[Matin] (" + newFilePath + ") folder is created.");
			d = new Date();
			var newFile = newDir.createFile("sensordata_" + d.toString().replace(/:| /g, "_") +".txt");
			console.log("[Matin] New file is created.");
			writeDataToFile(newFile);
		});
		function onRoamResolve(roamResult) {
			console.log("[Matin] ROAMM folder is resolved. So just create the file!");
			d = new Date();
			var newFile = roamResult.createFile("sensordata_" + d.toString().replace(/:| /g, "_") +".txt");
			console.log("[Matin] New file is created.");
			writeDataToFile(newFile);
		};
	}
}

/**
 * Given the newly created file, it opens it and writes the local storage into it. <br>
 * <i>Whenever this task is done, it <u>clears the DB</u>, because it is now available in the file and should not be kept somewhere else.</i>
 * @author matinkheirkhahan
 * @param newFile
 */
function writeDataToFile(newFile, data) {
	try {
		console.log("[Matin] writeDataToFile started...");
		if(newFile != null) {
			newFile.openStream("a", onOpenStream, function(error) {
				console.log("[Matin] Could not open file stream.");
				console.log(error);
			}, "UTF-8");

			function onOpenStream(fs) {
				
				console.log("fs", fs, data, newFile);
				
				var jsonString = JSON.stringify(data);
				fs.write(JSON.stringify(data));
				console.log("[Matin] this is the data to be written [dataToFile]>>>\n" + jsonString);
				fs.close();
				console.log("[Matin] Data is written into the file");
			};
		} else {
			console.log("[Matin] no file here to write into!...");
		}
		console.log("[Matin] writeDataToFile ended!!!");
	} catch (exception) {
		console.log("[Matin] [Exception] " + exception.message);
	}
}

function writeDatabasesToFile(data, filename){
	d = new Date();
	var documentsDir;
	console.log("writeDatabasesToFile started...");
	tizen.filesystem.resolve("documents", onDocumentResolve, function(error) {
		console.log("Could not resolve documents folder.");
		console.log(error);
	});

	function onDocumentResolve(result) {
		console.log("Documents folder resolved...");
		documentsDir = result;
		var newFilePath = "ROAMM";
		var newFilename = filename + "_" + d.toString().replace(/:| /g, "_") +".txt";
		var newFile;
		var newDir;
		
		tizen.filesystem.resolve("documents/" + newFilePath,
			
			function (roamResult) {	
			
				console.log(roamResult);
							
				console.log("ROAMM folder is resolved. So just create the file!");
				newFile = roamResult.createFile(newFilename);
				console.log("[Matin] New file is created.");
				
				console.log("newfile", newFile);
				
				writeDataToFile(newFile, data);
			}, 
				
			function(error){
				console.log("ROAMM folder could not be resolved. It should be created...");
				newDir = documentsDir.createDirectory(newFilePath);
				console.log("(" + newFilePath + ") folder is created.");
				
				console.log(newDir);
				
				newFile = newDir.createFile(newFilename);
				
				console.log("New file is created.");
				
				console.log("newFile", newFile);
				writeDataToFile(newFile, data);
			}, "a");
		;
	}
}