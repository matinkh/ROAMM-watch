// Structure of a single data item
function Item(){
	this.steps = null;
	this.heartrate = null;
	this.accelX = null;
	this.accelY = null;
	this.accelZ = null;
	this.gyroA = null;
	this.gyroB = null;
	this.gyroC = null;
	this.locLat = null;
	this.locLon = null;
	this.uv = null;
	this.pressure = null;
	this.timestamp = null;
	this.battery = null;
}

// used to format timestamps into a postgres database friendly format
function formatLocalDate() {
	var now = new Date(),
	tzo = -now.getTimezoneOffset(),
	dif = tzo >= 0 ? '+' : '-',
			pad = function(num) {
		var norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return now.getFullYear() 
	+ '-' + pad(now.getMonth()+1)
	+ '-' + pad(now.getDate())
	+ 'T' + pad(now.getHours())
	+ ':' + pad(now.getMinutes()) 
	+ ':' + pad(now.getSeconds()) 
	+ dif + pad(tzo / 60) 
	+ ':' + pad(tzo % 60);
}

// NOT USED
function putItem(key, data){
	console.log(key);
	console.log(data);
	/* Set the local storage item */
	if ("localStorage" in window) {
		if(localStorage.getItem(key) !== null){
			console.log("duplicate key");
		}
		else{
			try{
				localStorage.setItem(key, data);
			}
			catch (e){
				console.log("error");
			}
		}
	}
	else 
	{
		console.log("no localStorage in window");
	}
}

// Multiple functions used to store and clear values from each sensor
// into their respective spots in sessionStorage as they are sent out
function saveSteps(steps){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.steps", steps);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearSteps(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.steps");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveHeartrate(heartrate){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.heartrate", heartrate);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearHeartrate(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.heartrate");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveAccel(accel){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.accelX", accel[0]);
		sessionStorage.setItem("com.uf.agingproject.accelY", accel[1]);
		sessionStorage.setItem("com.uf.agingproject.accelZ", accel[2]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearAccel(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.accelX");
		sessionStorage.removeItem("com.uf.agingproject.accelY");
		sessionStorage.removeItem("com.uf.agingproject.accelZ");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveGyro(gyro){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.gyroA", gyro[0]);
		sessionStorage.setItem("com.uf.agingproject.gyroB", gyro[1]);
		sessionStorage.setItem("com.uf.agingproject.gyroC", gyro[2]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearGyro(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.gyroA");
		sessionStorage.removeItem("com.uf.agingproject.gyroB");
		sessionStorage.removeItem("com.uf.agingproject.gyroC");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveCoordinates(coords){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.locLat", coords[0]);
		sessionStorage.setItem("com.uf.agingproject.locLon", coords[1]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearCoordinates(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.locLat");
		sessionStorage.removeItem("com.uf.agingproject.locLon");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveUV(uv){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.uv", uv);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearUV(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.uv");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function savePressure(pressure){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.pressure", pressure);
	}
	else {
		console.log("no sessionStorage in window");
	}
}
function clearPressure(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.pressure");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveBattery(battery){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.battery", battery);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearBattery(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.battery");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

// clear everything but battery, since its OK to hold the previous value
function clearSessionData(){
	clearSteps();
	clearAccel();
	//clearBattery();
	clearCoordinates();
	clearGyro();
	clearHeartrate();
	clearPressure();
	clearUV();
}



function storeConfig(json){
	localStorage.setItem("com.uf.agingproject.config", JSON.stringify(json));
}

//NOTE: device storage only allows {string:string} pairs
function storeData(){
	/*
	// get the json array and parse it
	var data = JSON.parse(localStorage.getItem("com.uf.agingproject.data"));
	//console.log("retrieved local data store");
	dataFull = false;


	if(data && data.length > 150){
		dataFull = true;
	}
	*/
	var item = Object.create(Item.prototype);

	item.steps = sessionStorage.getItem("com.uf.agingproject.steps");
	item.heartrate = sessionStorage.getItem("com.uf.agingproject.heartrate");
	item.accelX = sessionStorage.getItem("com.uf.agingproject.accelX");
	item.accelY = sessionStorage.getItem("com.uf.agingproject.accelY");
	item.accelZ = sessionStorage.getItem("com.uf.agingproject.accelZ");

	item.gyroA = sessionStorage.getItem("com.uf.agingproject.gyroA");
	item.gyroB = sessionStorage.getItem("com.uf.agingproject.gyroB");
	item.gyroC = sessionStorage.getItem("com.uf.agingproject.gyroC");

	item.locLat = sessionStorage.getItem("com.uf.agingproject.locLat");
	item.locLon = sessionStorage.getItem("com.uf.agingproject.locLon");
	item.timestamp = formatLocalDate(Date());
	item.uv = sessionStorage.getItem("com.uf.agingproject.uv");
	item.pressure = sessionStorage.getItem("com.uf.agingproject.pressure");

	item.battery = sessionStorage.getItem("com.uf.agingproject.battery");
	
	// clears data in sessionstorage
	clearSessionData();
	
	addToDB(item);

	/*
	if(data){
		//console.log("appending to existing data store");
		data.push(item);
	}
	else{
		console.log("creating new local data store");
		data = [];
		data.push(item);
	}

	// convert back to JSON string before storing
	localStorage.setItem("com.uf.agingproject.data", JSON.stringify(data));
	

	if(dataFull){
		sendLocalData();
	}
	*/
}

//move data stored in sessionStorage to localStorage every x seconds
function startLocalStorageInterval(){
	var rate =  parseInt(localStorage.getItem("com.uf.agingproject.exportRate"));
	console.log("setting interval of local storage to " + rate);

	window.setInterval(function(){
		storeData();
	}, rate);
}

var database;
// Get the DB instance existing on the watch
// This will only actually create a new one if one doesnt already exist
// Else it will retrieve the existing one
function createDBUsingWrapper(){
	database = new IDBStore({
		dbVersion: 1,
		storeName: 'data',
		keyPath: 'id',
		autoIncrement: true,
		onStoreReady: function(){
			console.log('Store ready!');
		}
	});
}

// insert a single item to the database
function addToDB(item){
 
	var onsuccess = function(id){
		//console.log('Data is added: ' + id);
	}
	var onerror = function(error){
		console.log('Error', error);
	}
 
	database.put(item, onsuccess, onerror);
}

// clears all items in the database
// called by export manager after a successful transfer
function clearDB(){
	console.log("Clearing Local Storage");
	
	var onsuccess = function(){
		console.log("Local Store Cleared");
	}
	
	var onerror = function(error){
		console.log(error);
	}
	
	database.clear(onsuccess, onerror);
}

// used for debugging, dump all local storage to the console
function printAllData(){
	var onsuccess = function(array){
		console.log(array);
		console.log(JSON.stringify(array));
	},
	onerror = function(error){
		console.log(error);
	};
	
	database.getAll(onsuccess,onerror);
}

// print how many values are stored in local storage to the console
function printDataCount(){
	var onsuccess = function(array){
		console.log(array.length);
	},
	onerror = function(error){
		console.log(error);
	};
	
	database.getAll(onsuccess,onerror);
}

// used by other files to get the correct reference to the database
function getDatabase(){
	return database;
}



